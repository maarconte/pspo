/** Another module already uses this title (modules are linked to questions by title). */
export class DuplicateModuleTitleError extends Error {
  constructor(title: string) {
    super(`A module titled "${title}" already exists`);
    this.name = 'DuplicateModuleTitleError';
  }
}
