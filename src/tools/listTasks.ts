import * as changeCase from "change-case";

import { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { executeCommand } from '../lib/commandExecutor.js';
/**
 * listTasks.ts
 *
 * Purpose:
 * - Provides the functionality to list tasks in the backlog.
 * - Exposes this functionality as an MCP tool.
 *
 * Logic Overview:
 * - Defines a Zod schema for input validation.
 * - The `execute` function constructs a `backlog task list` command.
 * - The command is passed to the centralized `executeCommand` function.
 *
 * Last Updated:
 * 2025-07-21 by Cline (Refactored to use centralized command executor)
 */
import { z } from 'zod';

const schema = {
  status: z.string().optional().describe('Filter by status'),
  assignee: z.string().optional().describe('Filter by assignee'),
  parent: z.string().optional().describe('Filter by parent task ID'),
};
const zSchema = z.object(schema);

async function execute(params: z.infer<typeof zSchema>): Promise<CallToolResult> {
  let command = `backlog task list`;
  if (params.status) command += ` --status "${params.status}"`;
  if (params.assignee) command += ` --assignee "${params.assignee}"`;
  if (params.parent) command += ` --parent "${params.parent}"`;

  return executeCommand(command, 'Tasks listed successfully');
}

export default {
  definition: {
    name: 'listTasks',
    title: changeCase.capitalCase('listTasks'),
    description: 'List tasks in backlog.md',
    inputSchema: schema,
  },
  execute,
};
