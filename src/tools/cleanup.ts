import * as changeCase from 'change-case';

import { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { executeCommand } from '../lib/commandExecutor.js';
import logger from '../lib/logger.js';
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

const toolLogger = logger.child({ context: 'Cleanup' });
const schema = {};
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const zSchema = z.object(schema);

async function execute(): Promise<CallToolResult> {
  toolLogger.info('Cleaning up tasks');
  const command = `backlog cleanup`;
  return executeCommand(command, 'Cleanup successful');
}

export default {
  definition: {
    name: 'cleanup',
    title: changeCase.capitalCase('cleanup'),
    description: 'Cleanup done tasks in backlog.md',
    inputSchema: schema,
  },
  execute,
};
