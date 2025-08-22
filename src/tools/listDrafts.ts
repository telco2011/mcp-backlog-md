/**
 * @file listDrafts.ts
 * @description Defines the MCP tool for listing drafts in backlog.md.
 * This tool maps directly to the `backlog draft list` CLI command.
 */
import * as changeCase from 'change-case';
import { z } from 'zod';

import { CallToolResult } from '@modelcontextprotocol/sdk/types.js';

import { executeCommand } from '../lib/commandExecutor.js';
import { withProjectPath } from '../lib/schemas.js';
import { backlogCommand } from '../lib/utils.js';

const name = 'listDrafts';

const schema = {
  sort: z.string().optional().describe('Sort drafts by field (priority, id)'),
  plain: z.boolean().describe('View in plain mode for AI').default(true),
  ...withProjectPath.shape,
};

export const _zSchema = z.object(schema);

async function execute(params: z.infer<typeof _zSchema>): Promise<CallToolResult> {
  console.info('Listing drafts', params);
  let command = `${backlogCommand} draft list`;
  if (params.sort) command += ` --sort ${params.sort}`;
  if (params.plain) command += ` --plain`;

  return executeCommand({
    command,
    successMessage: 'Drafts listed successfully',
    projectPath: params.projectPath,
  });
}

export default {
  definition: {
    name,
    title: changeCase.capitalCase(name),
    description: 'List drafts in backlog.md',
    inputSchema: schema,
  },
  execute,
};
