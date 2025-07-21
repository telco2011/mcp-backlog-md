import { executeCommand } from '../lib/commandExecutor.js';
/**
 * createDecision.ts
 *
 * Purpose:
 * - Provides the functionality to create a new decision in the backlog.
 * - Exposes this functionality as an MCP tool.
 *
 * Logic Overview:
 * - Defines a Zod schema for input validation.
 * - The `execute` function constructs a `backlog decision create` command.
 * - The command is passed to the centralized `executeCommand` function.
 *
 * Last Updated:
 * 2025-07-21 by Cline (Refactored to use centralized command executor)
 */
import { z } from 'zod';

const schema = z.object({
  title: z.string().describe('The title of the decision'),
  status: z.string().optional().describe('The status of the decision'),
});

async function execute(params: z.infer<typeof schema>): Promise<string> {
  let command = `backlog decision create "${params.title}"`;
  if (params.status) command += ` --status "${params.status}"`;

  return executeCommand(command, 'Decision created successfully');
}

export default {
  definition: {
    name: 'createDecision',
    description: 'Create a new decision in backlog.md',
    input_schema: schema,
  },
  execute,
};
