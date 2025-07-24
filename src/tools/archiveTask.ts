import * as changeCase from 'change-case';

import { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { backlogCommand } from '../lib/utils.js';
import { executeCommand } from '../lib/commandExecutor.js';
/**
 * archiveTask.ts
 *
 * Purpose:
 * - Provides the functionality to archive a task in the backlog.
 * - Exposes this functionality as an MCP tool.
 *
 * Logic Overview:
 * - Defines a Zod schema for input validation.
 * - The `execute` function constructs a `backlog task archive` command.
 * - The command is passed to the centralized `executeCommand` function.
 *
 * Last Updated:
 * 2025-07-21 by Cline (Refactored to use centralized command executor)
 */
import { z } from 'zod';

const name = 'archiveTask';
const schema = {
  id: z.string().describe('The ID of the task to archive'),
};
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const zSchema = z.object(schema);

async function execute(
  params: z.infer<typeof zSchema>
): Promise<CallToolResult> {
  console.info('Archiving task', params);
  const command = `${backlogCommand} task archive ${params.id}`;
  return executeCommand(command, 'Task archived successfully');
}

export default {
  definition: {
    name,
    title: changeCase.capitalCase(name),
    description: 'Archive a task in backlog.md',
    inputSchema: schema,
  },
  execute,
};
