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
import * as changeCase from 'change-case';

import { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { backlogCommand } from '../lib/utils.js';
import { executeCommand } from '../lib/commandExecutor.js';
import { withProjectPath } from '../lib/schemas.js';
import { z } from 'zod';

const name = 'listTasks';
const schema = {
  status: z.string().optional().describe('Filter by status'),
  assignee: z.string().optional().describe('Filter by assignee'),
  parent: z.string().optional().describe('Filter by parent task ID'),
  priority: z.string().optional().describe('Filter by priority (high, medium, low)'),
  sort: z.string().optional().describe('Sort tasks by field (priority, id)'),
  plain: z.boolean().describe('View in plain mode for AI').default(true),
  ...withProjectPath.shape,
};
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const zSchema = z.object(schema);

async function execute(params: z.infer<typeof zSchema>): Promise<CallToolResult> {
  console.info('Listing tasks', params);
  let command = `${backlogCommand} task list`;
  if (params.status) command += ` --status "${params.status}"`;
  if (params.assignee) command += ` --assignee "${params.assignee}"`;
  if (params.parent) command += ` --parent "${params.parent}"`;
  if (params.priority) command += ` --priority "${params.priority}"`;
  if (params.sort) command += ` --sort "${params.sort}"`;
  if (params.plain) command += ' --plain';

  return executeCommand({
    command,
    successMessage: 'Tasks listed successfully',
    projectPath: params.projectPath,
  });
}

export default {
  definition: {
    name,
    title: changeCase.capitalCase(name),
    description: 'List tasks in backlog.md',
    inputSchema: schema,
  },
  execute,
};
