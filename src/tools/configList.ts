import * as changeCase from 'change-case';

import { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { executeCommand } from '../lib/commandExecutor.js';
/**
 * configList.ts
 *
 * Purpose:
 * - Provides the functionality to list the configuration in the backlog.
 * - Exposes this functionality as an MCP tool.
 *
 * Logic Overview:
 * - Defines an empty Zod schema as no parameters are needed.
 * - The `execute` function constructs a `backlog config list` command.
 * - The command is passed to the centralized `executeCommand` function.
 *
 * Last Updated:
 * 2025-07-21 by Cline (Refactored to use centralized command executor)
 */
import { z } from 'zod';

const schema = {};
const zSchema = z.object(schema);

async function execute(): Promise<CallToolResult> {
  const command = `backlog config list`;
  return executeCommand(command, 'Configuration listed successfully');
}

export default {
  definition: {
    name: 'configList',
    title: changeCase.capitalCase('configList'),
    description: 'List the configuration in backlog.md',
    inputSchema: schema,
  },
  execute,
};
