import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import test from 'firebase-functions-test';

process.env.GCLOUD_PROJECT = 'demo-project';

const testEnv = test({
    projectId: 'demo-project',
});

const { setCustomUserClaims, firestoreSet } = vi.hoisted(() => {
    return {
        setCustomUserClaims: vi.fn(async () => {
             await new Promise(resolve => setTimeout(resolve, 100));
        }),
        firestoreSet: vi.fn(async () => {
             await new Promise(resolve => setTimeout(resolve, 100));
        })
    };
});

vi.mock('firebase-admin', async (importOriginal) => {
    return {
        initializeApp: vi.fn(),
        auth: vi.fn(() => ({
            setCustomUserClaims: setCustomUserClaims
        })),
        firestore: Object.assign(vi.fn(() => ({
            collection: vi.fn(() => ({
                doc: vi.fn(() => ({
                    set: firestoreSet
                }))
            }))
        })), {
            FieldValue: {
                serverTimestamp: vi.fn()
            }
        })
    };
});

// Import the function AFTER mocking
import { setUserRole, onUserCreated } from './index';

describe('Performance Benchmarks', () => {
    afterEach(() => {
        testEnv.cleanup();
        vi.clearAllMocks();
    });

    it('setUserRole should complete within expected time', async () => {
        const wrapped = testEnv.wrap(setUserRole);

        const context = {
            auth: {
                uid: 'test-admin-uid',
                token: { role: 'dev' }
            }
        };

        const data = {
            userId: 'target-user-id',
            role: 'admin'
        };

        const start = performance.now();
        await wrapped(data, context);
        const end = performance.now();

        const duration = end - start;
        console.log(`setUserRole execution time: ${duration.toFixed(2)}ms`);

        expect(setCustomUserClaims).toHaveBeenCalledWith('target-user-id', { role: 'admin' });
        expect(firestoreSet).toHaveBeenCalled();
    });

    it('onUserCreated should complete within expected time', async () => {
        const wrapped = testEnv.wrap(onUserCreated);

        const user = testEnv.auth.makeUserRecord({
            uid: 'new-user-id',
            email: 'test@example.com'
        });

        const start = performance.now();
        await wrapped(user);
        const end = performance.now();

        const duration = end - start;
        console.log(`onUserCreated execution time: ${duration.toFixed(2)}ms`);

        expect(setCustomUserClaims).toHaveBeenCalledWith('new-user-id', { role: 'client' });
        expect(firestoreSet).toHaveBeenCalled();
    });
});
