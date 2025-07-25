import * as changeCase from 'change-case';

import { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { backlogCommand } from '../lib/utils.js';
import { executeCommand } from '../lib/commandExecutor.js';
import { withProjectPath } from '../lib/schemas.js';
/**
 * browser.ts
 *
 * Purpose:
 * - Provides the functionality to launch the web UI for the backlog.
 * - Exposes this functionality as an MCP tool.
 *
 * Logic Overview:
 * - Defines a Zod schema for input validation.
 * - The `execute` function constructs a `backlog browser` command.
 * - The command is passed to the centralized `executeCommand` function.
 *
 * Last Updated:
 * 2025-07-21 by Cline (Refactored to use centralized command executor)
 */
import { z } from 'zod';

const name = 'browser';
const schema = {
  port: z.number().optional().describe('The port to launch the web UI on'),
  noOpen: z.boolean().optional().describe("Don't open the browser automatically").default(true),
  ...withProjectPath.shape,
};
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const zSchema = z.object(schema);

async function execute(params: z.infer<typeof zSchema>): Promise<CallToolResult> {
  console.info('Launching browser', params);
  let command = `${backlogCommand} browser`;
  if (params.port) command += ` --port ${params.port}`;
  if (params.noOpen) command += ` --no-open`;

  return executeCommand({
    command,
    successMessage: 'Browser launched successfully',
    projectPath: params.projectPath,
  });
}

export default {
  definition: {
    name,
    title: changeCase.capitalCase(name),
    description: 'Launch the web UI for backlog.md',
    inputSchema: schema,
  },
  execute,
};
