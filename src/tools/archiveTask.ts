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

import { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { backlogCommand } from '../lib/utils.js';
import { executeCommand } from '../lib/commandExecutor.js';
import { withProjectPath } from '../lib/schemas.js';
import { z } from 'zod';

const name = 'archiveTask';
const schema = {
  id: z.string().optional().describe('The ID of the task to archive'),
  ids: z
    .string()
    .optional()
    .describe('A comma-separated string of task IDs to archive'),
  ...withProjectPath.shape,
};
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const zSchema = z
  .object(schema)
  .refine((data) => data.id || data.ids, {
    message: 'Either id or ids must be provided',
  });

async function execute(
  params: z.infer<typeof zSchema>,
): Promise<CallToolResult> {
  console.info('Archiving task(s)', params);
  const taskIds = params.ids
    ? params.ids.split(',').map((id) => id.trim())
    : [params.id!];

  const results = await Promise.all(
    taskIds.map((id) => {
      const command = `${backlogCommand} task archive ${id}`;
      return executeCommand({
        command,
        successMessage: `Task ${id} archived successfully`,
        projectPath: params.projectPath,
      });
    }),
  );

  const successful = results.filter((r) => r.result === 'success');
  const failed = results.filter((r) => r.result !== 'success');

  if (failed.length > 0) {
    const failedIds = failed
      .map((f) => (f.result as string).split(' ')[1])
      .join(', ');
    return {
      result: `Failed to archive the following tasks: ${failedIds}`,
      content: [],
    };
  }

  return {
    result: `Successfully archived ${successful.length} tasks.`,
    content: [],
  };
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
