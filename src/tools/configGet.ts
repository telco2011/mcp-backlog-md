/**
 * @file configGet.ts
 * @description Defines the MCP tool for getting configuration values in backlog.md.
 * This tool maps directly to the `backlog config get` CLI command.
 */
import * as changeCase from 'change-case';
import { z } from 'zod';

import { CallToolResult } from '@modelcontextprotocol/sdk/types.js';

import { executeCommand } from '../lib/commandExecutor.js';
import { withProjectPath } from '../lib/schemas.js';
import { backlogCommand } from '../lib/utils.js';

const name = 'configGet';

const schema = {
  key: z.string().describe('The configuration key to get'),
  ...withProjectPath.shape,
};

export const _zSchema = z.object(schema);

async function execute(params: z.infer<typeof _zSchema>): Promise<CallToolResult> {
  console.info('Getting configuration', params);
  const command = `${backlogCommand} config get ${params.key}`;

  return executeCommand({
    command,
    successMessage: 'Configuration value retrieved successfully',
    projectPath: params.projectPath,
  });
}

export default {
  definition: {
    name,
    title: changeCase.capitalCase(name),
    description: 'Get a configuration value in backlog.md',
    inputSchema: schema,
  },
  execute,
};