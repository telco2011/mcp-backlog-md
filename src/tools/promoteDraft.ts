import { executeCommand } from '../lib/commandExecutor';
/**
 * promoteDraft.ts
 *
 * Purpose:
 * - Provides the functionality to promote a draft to a task in the backlog.
 * - Exposes this functionality as an MCP tool.
 *
 * Logic Overview:
 * - Defines a Zod schema for input validation.
 * - The `execute` function constructs a `backlog draft promote` command.
 * - The command is passed to the centralized `executeCommand` function.
 *
 * Last Updated:
 * 2025-07-21 by Cline (Refactored to use centralized command executor)
 */
import { z } from 'zod';

const schema = z.object({
  id: z.string().describe('The ID of the draft to promote'),
});

async function execute(params: z.infer<typeof schema>): Promise<string> {
  const command = `backlog draft promote ${params.id}`;
  return executeCommand(command, 'Draft promoted successfully');
}

export default {
  definition: {
    name: 'promoteDraft',
    description: 'Promote a draft to a task in backlog.md',
    input_schema: schema,
  },
  execute,
};
