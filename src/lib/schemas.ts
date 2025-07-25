/**
 * schemas.ts
 *
 * Purpose:
 * - Defines reusable Zod schemas that are shared across multiple tool definitions.
 * - Centralizes common input parameters to ensure consistency.
 *
 * Logic Overview:
 * - Exports a `withProjectPath` schema object that includes a `projectPath` string.
 * - This allows any tool to easily include a standardized, optional `projectPath` parameter with a default value.
 *
 * Last Updated:
 * 2025-07-25 by Cline (Model: Cline, Task: Add missing file header)
 */
import { z } from 'zod';

export const withProjectPath = z.object({
  projectPath: z.string().describe('The path to the project').default(process.cwd()),
});
