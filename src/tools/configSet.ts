import * as changeCase from 'change-case';

import { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { executeCommand } from '../lib/commandExecutor.js';
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

const name = 'configSet';
const schema = {
  key: z.string().describe('The configuration key to set'),
  value: z.string().describe('The value to set for the configuration key'),
};
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const zSchema = z.object(schema);

async function execute(
  params: z.infer<typeof zSchema>
): Promise<CallToolResult> {
  console.info('Setting configuration', params);
  const command = `backlog config set ${params.key} ${params.value}`;
  return executeCommand(command, 'Configuration set successfully');
}

export default {
  definition: {
    name,
    title: changeCase.capitalCase(name),
    description: 'Set a configuration value in backlog.md',
    inputSchema: schema,
  },
  execute,
};
