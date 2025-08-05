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
import * as changeCase from 'change-case';
import { z } from 'zod';

import { CallToolResult } from '@modelcontextprotocol/sdk/types.js';

import { executeCommand } from '../lib/commandExecutor.js';
import { SystemError } from '../lib/errors.js';
import { withProjectPath } from '../lib/schemas.js';
import { backlogCommand } from '../lib/utils.js';

const name = 'archiveTask';
const schema = {
  id: z.string().optional().describe('The ID of the task to archive'),
  ids: z.string().optional().describe('A comma-separated string of task IDs to archive'),
  ...withProjectPath.shape,
};
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const zSchema = z.object(schema).refine((data) => data.id || data.ids, {
  message: 'Either id or ids must be provided',
});

async function execute(params: z.infer<typeof zSchema>): Promise<CallToolResult> {
  console.info('Archiving task(s)', params);
  if (!params.id && !params.ids) {
    throw new SystemError('Either "id" or "ids" must be provided to archive a task.', { cause: new Error('Invalid parameters') });
  }
  const taskIds = params.ids ? params.ids.split(',').map((id) => id.trim()) : [params.id!];

  const results: { successful: unknown[]; failed: unknown[] } = { successful: [], failed: [] };
  for (const id of taskIds) {
    const command = `${backlogCommand} task archive ${id}`;
    console.info(`Executing command: ${command}`);
    try {
      results.successful.push(
        await executeCommand({
          command,
          successMessage: `Task ${id} archived successfully`,
          projectPath: params.projectPath,
        })
      );
    } catch (error) {
      console.error(`Failed to archive task ${id}:`, error);
      results.failed.push(`Task ${id} could not be archived: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  return {
    result: `Successfully archived ${results.successful.length} tasks. Failed to archive ${results.failed.length} tasks: ${results.failed.join(', ')}`,
    content: [],
  };
}

export default {
  definition: {
    name,
    title: changeCase.capitalCase(name),
    description: 'Archive a task, or tasks, in backlog.md',
    inputSchema: schema,
  },
  execute,
};
