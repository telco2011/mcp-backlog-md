import * as changeCase from 'change-case';

import { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { backlogCommand } from '../lib/utils.js';
import { executeCommand } from '../lib/commandExecutor.js';
/**
 * cleanup.ts
 *
 * Purpose:
 * - Provides the functionality to cleanup done tasks in the backlog.
 * - Exposes this functionality as an MCP tool.
 *
 * Logic Overview:
 * - Defines an empty Zod schema as no parameters are needed.
 * - The `execute` function constructs a `backlog cleanup` command.
 * - The command is passed to the centralized `executeCommand` function.
 *
 * Last Updated:
 * 2025-07-21 by Cline (Refactored to use centralized command executor)
 */
import { z } from 'zod';

const name = 'cleanup';
const schema = {};
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const zSchema = z.object(schema);

async function execute(): Promise<CallToolResult> {
  console.info('Cleaning up tasks');
  const command = `${backlogCommand} cleanup`;
  return executeCommand(command, 'Cleanup successful');
}

export default {
  definition: {
    name,
    title: changeCase.capitalCase(name),
    description: 'Cleanup done tasks in backlog.md',
    inputSchema: schema,
  },
  execute,
};
