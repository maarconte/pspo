import { beforeEach, describe, expect, it, vi } from 'vitest';

const fb = vi.hoisted(() => {
  const batches: { update: ReturnType<typeof vi.fn>; commit: ReturnType<typeof vi.fn> }[] = [];
  return {
    batches,
    getDocs: vi.fn(),
    addDoc: vi.fn(),
    getDoc: vi.fn(),
    updateDoc: vi.fn(),
    where: vi.fn(),
  };
});

vi.mock('firebase/firestore', () => ({
  Timestamp: { fromDate: vi.fn((d: Date) => ({ toDate: () => d })), now: vi.fn() },
  collection: vi.fn(),
  addDoc: fb.addDoc,
  updateDoc: fb.updateDoc,
  deleteDoc: vi.fn(),
  doc: vi.fn(() => 'moduleRef'),
  query: vi.fn((...args: unknown[]) => args),
  where: fb.where,
  onSnapshot: vi.fn(),
  getDoc: fb.getDoc,
  getDocs: fb.getDocs,
  serverTimestamp: vi.fn(() => 'ts'),
  increment: vi.fn(),
  writeBatch: vi.fn(() => {
    const batch = { update: vi.fn(), commit: vi.fn().mockResolvedValue(undefined) };
    fb.batches.push(batch);
    return batch;
  }),
}));
vi.mock('firebase/storage', () => ({
  ref: vi.fn(),
  uploadBytes: vi.fn(),
  getDownloadURL: vi.fn(),
  deleteObject: vi.fn(),
  getStorage: vi.fn(),
}));
vi.mock('../../../lib/firebase/firestore', () => ({ db: {} }));
vi.mock('../../../lib/firebase/config', () => ({ app: {} }));

import { DuplicateModuleTitleError } from './moduleErrors';
import { createModule, renameQuestionsFormation, updateModule } from './modules.api';

const modules = (...titles: string[]) => ({
  docs: titles.map((title, i) => ({ id: `m${i + 1}`, data: () => ({ title }) })),
});

const questionDocs = (n: number) =>
  Array.from({ length: n }, (_, i) => ({ ref: `q${i}` }));

describe('renaming a module keeps its questions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    fb.batches.length = 0;
    fb.getDocs.mockResolvedValue({ docs: questionDocs(3) });
    fb.getDoc.mockResolvedValue({ data: () => ({ title: 'PSM' }) });
  });

  it('rewrites type on every question of the old formation', async () => {
    const count = await renameQuestionsFormation('PSM', 'PSM-I');
    expect(count).toBe(3);
    expect(fb.where).toHaveBeenCalledWith('type', '==', 'PSM');
    expect(fb.batches).toHaveLength(1);
    expect(fb.batches[0].update).toHaveBeenCalledTimes(3);
    expect(fb.batches[0].update).toHaveBeenCalledWith('q0', { type: 'PSM-I' });
  });

  it('splits large renames into batches of 400', async () => {
    fb.getDocs.mockResolvedValue({ docs: questionDocs(950) });
    await renameQuestionsFormation('PSM', 'PSM-I');
    expect(fb.batches.map((b) => b.update.mock.calls.length)).toEqual([400, 400, 150]);
  });

  it('does nothing when the formation is unchanged', async () => {
    expect(await renameQuestionsFormation('PSM', 'PSM')).toBe(0);
    expect(fb.getDocs).not.toHaveBeenCalled();
  });

  it('migrates questions before saving the new title', async () => {
    const order: string[] = [];
    fb.batches.length = 0;
    fb.updateDoc.mockImplementation(async () => void order.push('module'));
    fb.getDocs.mockResolvedValueOnce(modules('PSM')); // uniqueness check
    fb.getDocs.mockImplementation(async () => {
      order.push('questions');
      return { docs: questionDocs(1) };
    });

    await updateModule('m1', { title: 'PSM-I' });
    expect(order).toEqual(['questions', 'module']);
    expect(fb.batches[0].update).toHaveBeenCalledWith('q0', { type: 'PSM-I' });
  });

  it('keeps the module untouched when the questions migration fails', async () => {
    fb.getDocs.mockRejectedValue(new Error('network'));
    await expect(updateModule('m1', { title: 'PSM-I' })).rejects.toThrow('network');
    expect(fb.updateDoc).not.toHaveBeenCalled();
  });

  it('maps the display title back to the stored value (PSPO-I <-> pspo-I)', async () => {
    fb.getDoc.mockResolvedValue({ data: () => ({ title: 'PSPO-I' }) });
    fb.getDocs.mockResolvedValueOnce(modules('PSPO-I')); // uniqueness check
    await updateModule('m1', { title: 'PSPO-I Advanced' });
    expect(fb.where).toHaveBeenCalledWith('type', '==', 'pspo-I');
    expect(fb.batches[0].update).toHaveBeenCalledWith('q0', { type: 'PSPO-I Advanced' });
  });

  it('does not touch questions when the title does not change', async () => {
    await updateModule('m1', { title: 'PSM', isActive: false });
    expect(fb.getDocs).not.toHaveBeenCalled();
    expect(fb.updateDoc).toHaveBeenCalledTimes(1);
  });

  it('does not touch questions when the title is not edited', async () => {
    await updateModule('m1', { isActive: false });
    expect(fb.getDoc).not.toHaveBeenCalled();
    expect(fb.getDocs).not.toHaveBeenCalled();
  });
});

describe('module title uniqueness', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    fb.batches.length = 0;
    fb.addDoc.mockResolvedValue({ id: 'new' });
  });

  it('rejects creating a module whose title is taken', async () => {
    fb.getDocs.mockResolvedValue(modules('PSM', 'PSPO-I'));
    await expect(
      createModule({ title: 'PSM', isActive: true, quizDuration: '01:00', questionCount: 80, minSuccessPercent: 85 }),
    ).rejects.toBeInstanceOf(DuplicateModuleTitleError);
    expect(fb.addDoc).not.toHaveBeenCalled();
  });

  it('compares titles case-insensitively and ignoring surrounding spaces', async () => {
    fb.getDocs.mockResolvedValue(modules('PSPO-I'));
    await expect(
      createModule({ title: '  pspo-i ', isActive: true, quizDuration: '01:00', questionCount: 80, minSuccessPercent: 85 }),
    ).rejects.toBeInstanceOf(DuplicateModuleTitleError);
  });

  it('creates a module with a free title', async () => {
    fb.getDocs.mockResolvedValue(modules('PSM'));
    await createModule({ title: 'PSPO-I', isActive: true, quizDuration: '01:00', questionCount: 80, minSuccessPercent: 85 });
    expect(fb.addDoc).toHaveBeenCalledTimes(1);
  });

  it('rejects renaming a module to another module\'s title, touching nothing', async () => {
    fb.getDoc.mockResolvedValue({ data: () => ({ title: 'PSM' }) });
    fb.getDocs.mockResolvedValue(modules('PSM', 'PSPO-I')); // m1 = PSM (self), m2 = PSPO-I
    await expect(updateModule('m1', { title: 'pspo-i' })).rejects.toBeInstanceOf(
      DuplicateModuleTitleError,
    );
    expect(fb.batches).toHaveLength(0);
    expect(fb.updateDoc).not.toHaveBeenCalled();
  });

  it('allows a case-only rename of the module itself', async () => {
    fb.getDoc.mockResolvedValue({ data: () => ({ title: 'psm' }) });
    fb.getDocs
      .mockResolvedValueOnce(modules('psm')) // uniqueness check: only itself
      .mockResolvedValueOnce({ docs: [{ ref: 'q0' }] }); // questions of the old formation
    await updateModule('m1', { title: 'PSM' });
    expect(fb.updateDoc).toHaveBeenCalledTimes(1);
    expect(fb.batches[0].update).toHaveBeenCalledWith('q0', { type: 'PSM' });
  });

  it('does not check other modules when the title is unchanged', async () => {
    fb.getDoc.mockResolvedValue({ data: () => ({ title: 'PSM' }) });
    await updateModule('m1', { title: 'PSM', isActive: false });
    expect(fb.getDocs).not.toHaveBeenCalled();
    expect(fb.updateDoc).toHaveBeenCalledTimes(1);
  });
});
