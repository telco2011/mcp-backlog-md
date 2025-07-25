/**
 * viewTask.ts
 *
 * Purpose:
 * - Provides the functionality to view a task in the backlog.
 * - Exposes this functionality as an MCP tool.
 *
 * Logic Overview:
 * - Defines a Zod schema for input validation.
 * - The `execute` function constructs a `backlog task view` command.
 * - The command is passed to the centralized `executeCommand` function.
 *
 * Last Updated:
 * 2025-07-21 by Cline (Refactored to use centralized command executor)
 */
import * as changeCase from 'change-case';
import { z } from 'zod';

import { CallToolResult } from '@modelcontextprotocol/sdk/types.js';

import { executeCommand } from '../lib/commandExecutor.js';
import { withProjectPath } from '../lib/schemas.js';
import { backlogCommand } from '../lib/utils.js';

const name = 'viewTask';
const schema = {
  id: z.string().describe('The ID of the task to view'),
  plain: z.boolean().describe('View in plain mode for AI').default(true),
  ...withProjectPath.shape,
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const zSchema = z.object(schema);

async function execute(params: z.infer<typeof zSchema>): Promise<CallToolResult> {
  console.info('Viewing task', params);
  let command = `${backlogCommand} task view ${params.id}`;
  if (params.plain) command += ' --plain';

  return executeCommand({
    command,
    successMessage: 'Task viewed successfully',
    projectPath: params.projectPath,
  });
}

export default {
  definition: {
    name,
    title: changeCase.capitalCase(name),
    description: 'View a task in backlog.md',
    inputSchema: schema,
  },
  execute,
};
