import { executeCommand } from '../lib/commandExecutor';
/**
 * createDraft.ts
 *
 * Purpose:
 * - Provides the functionality to create a new draft task in the backlog.
 * - Exposes this functionality as an MCP tool.
 *
 * Logic Overview:
 * - Defines a Zod schema for input validation.
 * - The `execute` function constructs a `backlog draft create` command.
 * - The command is passed to the centralized `executeCommand` function.
 *
 * Last Updated:
 * 2025-07-21 by Cline (Refactored to use centralized command executor)
 */
import { z } from 'zod';

const schema = z.object({
  title: z.string().describe('The title of the draft'),
});

async function execute(params: z.infer<typeof schema>): Promise<string> {
  const command = `backlog draft create "${params.title}"`;
  return executeCommand(command, 'Draft created successfully');
}

export default {
  definition: {
    name: 'createDraft',
    description: 'Create a draft task in backlog.md',
    input_schema: schema,
  },
  execute,
};
