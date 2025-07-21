import { executeCommand } from '../lib/commandExecutor';
/**
 * archiveTask.ts
 *
 * Purpose:
 * - Provides the functionality to archive a task in the backlog.
 * - Exposes this functionality as an MCP tool.
 *
 * Logic Overview:
 * - Defines a Zod schema for input validation.
 * - The `execute` function constructs a `backlog task archive` command.
 * - The command is passed to the centralized `executeCommand` function.
 *
 * Last Updated:
 * 2025-07-21 by Cline (Refactored to use centralized command executor)
 */
import { z } from 'zod';

const schema = z.object({
  id: z.string().describe('The ID of the task to archive'),
});

async function execute(params: z.infer<typeof schema>): Promise<string> {
  const command = `backlog task archive ${params.id}`;
  return executeCommand(command, 'Task archived successfully');
}

export default {
  definition: {
    name: 'archiveTask',
    description: 'Archive a task in backlog.md',
    input_schema: schema,
  },
  execute,
};
