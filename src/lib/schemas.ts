import { z } from 'zod';

export const withRepoPath = z.object({
  repoPath: z.string().describe('The path to the repository').default(process.cwd()),
});
