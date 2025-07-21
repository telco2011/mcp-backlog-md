import * as changeCase from "change-case";

import { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { executeCommand } from '../lib/commandExecutor.js';
/**
 * viewBoard.ts
 *
 * Purpose:
 * - Provides the functionality to view the Kanban board in the backlog.
 * - Exposes this functionality as an MCP tool.
 *
 * Logic Overview:
 * - Defines an empty Zod schema as no parameters are needed.
 * - The `execute` function constructs a `backlog view board` command.
 * - The command is passed to the centralized `executeCommand` function.
 *
 * Last Updated:
 * 2025-07-21 by Cline (Refactored to use centralized command executor)
 */
import { z } from 'zod';

const schema = {};
const zSchema = z.object(schema);

async function execute(): Promise<CallToolResult> {
  const command = `backlog view board`;
  return executeCommand(command, 'Board viewed successfully');
}

export default {
  definition: {
    name: 'viewBoard',
    title: changeCase.capitalCase('viewBoard'),
    description: 'View the Kanban board in backlog.md',
    inputSchema: schema,
  },
  execute,
};
