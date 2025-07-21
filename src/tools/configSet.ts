import { executeCommand } from '../lib/commandExecutor';
/**
 * configSet.ts
 *
 * Purpose:
 * - Provides the functionality to set a configuration value in the backlog.
 * - Exposes this functionality as an MCP tool.
 *
 * Logic Overview:
 * - Defines a Zod schema for input validation.
 * - The `execute` function constructs a `backlog config set` command.
 * - The command is passed to the centralized `executeCommand` function.
 *
 * Last Updated:
 * 2025-07-21 by Cline (Refactored to use centralized command executor)
 */
import { z } from 'zod';

const schema = z.object({
  key: z.string().describe('The configuration key to set'),
  value: z.string().describe('The value to set for the configuration key'),
});

async function execute(params: z.infer<typeof schema>): Promise<string> {
  const command = `backlog config set ${params.key} ${params.value}`;
  return executeCommand(command, 'Configuration set successfully');
}

export default {
  definition: {
    name: 'configSet',
    description: 'Set a configuration value in backlog.md',
    input_schema: schema,
  },
  execute,
};
