import { z } from 'zod';

export const withProjectPath = z.object({
  projectPath: z.string().describe('The path to the project').default(process.cwd()),
});
