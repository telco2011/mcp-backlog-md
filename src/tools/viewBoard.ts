/**
 * @file viewBoard.ts
 * @description Defines the MCP tool for viewing the board in backlog.md.
 * This tool maps directly to the `backlog board view` CLI command.
 */
import * as changeCase from 'change-case';
import { z } from 'zod';

import { CallToolResult } from '@modelcontextprotocol/sdk/types.js';

import { executeCommand } from '../lib/commandExecutor.js';
import { withProjectPath } from '../lib/schemas.js';
import { backlogCommand } from '../lib/utils.js';

const name = 'viewBoard';

const schema = {
  plain: z.boolean().describe('View in plain mode for AI').default(true),
  ...withProjectPath.shape,
};

export const _zSchema = z.object(schema);

async function execute(params: z.infer<typeof _zSchema>): Promise<CallToolResult> {
  console.info('Viewing board', params);
  let command = `${backlogCommand} board view`;
  if (params.plain) command += ` --plain`;

  return executeCommand({
    command,
    successMessage: 'Board viewed successfully',
    projectPath: params.projectPath,
  });
}

export default {
  definition: {
    name,
    title: changeCase.capitalCase(name),
    description: 'View the board in backlog.md',
    inputSchema: schema,
  },
  execute,
};
