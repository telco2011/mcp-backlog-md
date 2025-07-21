import { executeCommand } from '../lib/commandExecutor';
/**
 * exportBoard.ts
 *
 * Purpose:
 * - Provides the functionality to export the Kanban board to a markdown file.
 * - Exposes this functionality as an MCP tool.
 *
 * Logic Overview:
 * - Defines a Zod schema for input validation.
 * - The `execute` function constructs a `backlog export board` command.
 * - The command is passed to the centralized `executeCommand` function.
 *
 * Last Updated:
 * 2025-07-21 by Cline (Refactored to use centralized command executor)
 */
import { z } from 'zod';

const schema = z.object({
  file: z.string().optional().describe('The file to export to'),
  force: z.boolean().optional().describe('Force overwrite of existing file'),
});

async function execute(params: z.infer<typeof schema>): Promise<string> {
  let command = `backlog export board`;
  if (params.file) command += ` --file ${params.file}`;
  if (params.force) command += ` --force`;

  return executeCommand(command, 'Board exported successfully');
}

export default {
  definition: {
    name: 'exportBoard',
    description: 'Export the Kanban board to a markdown file',
    input_schema: schema,
  },
  execute,
};
