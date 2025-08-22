/**
 * @file viewDraft.ts
 * @description Defines the MCP tool for viewing a draft in backlog.md.
 * This tool maps directly to the `backlog draft view` CLI command.
 */
import * as changeCase from 'change-case';
import { z } from 'zod';

import { CallToolResult } from '@modelcontextprotocol/sdk/types.js';

import { executeCommand } from '../lib/commandExecutor.js';
import { withProjectPath } from '../lib/schemas.js';
import { backlogCommand } from '../lib/utils.js';

const name = 'viewDraft';

const schema = {
  id: z.string().describe('The ID of the draft to view'),
  plain: z.boolean().describe('View in plain mode for AI').default(true),
  ...withProjectPath.shape,
};

export const _zSchema = z.object(schema);

async function execute(params: z.infer<typeof _zSchema>): Promise<CallToolResult> {
  console.info('Viewing draft', params);
  let command = `${backlogCommand} draft ${params.id}`;
  if (params.plain) command += ` --plain`;

  return executeCommand({
    command,
    successMessage: 'Draft viewed successfully',
    projectPath: params.projectPath,
  });
}

export default {
  definition: {
    name,
    title: changeCase.capitalCase(name),
    description: 'View a draft in backlog.md',
    inputSchema: schema,
  },
  execute,
};
