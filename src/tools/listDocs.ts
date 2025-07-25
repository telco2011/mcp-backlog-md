/**
 * listDocs.ts
 *
 * Purpose:
 * - Provides the functionality to list documents in the backlog.
 * - Exposes this functionality as an MCP tool.
 *
 * Logic Overview:
 * - Defines an empty Zod schema as no parameters are needed.
 * - The `execute` function constructs a `backlog doc list` command.
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

const name = 'listDocs';
const schema = {
  plain: z.boolean().optional().describe('View in plain mode for AI').default(true),
  ...withProjectPath.shape,
};
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const zSchema = z.object(schema);

async function execute(params: z.infer<typeof zSchema>): Promise<CallToolResult> {
  console.info('Listing documents');
  let command = `${backlogCommand} doc list`;
  if (params.plain) command += ' --plain';
  return executeCommand({
    command,
    successMessage: 'Documents listed successfully',
    projectPath: params.projectPath,
  });
}

export default {
  definition: {
    name,
    title: changeCase.capitalCase(name),
    description: 'List documents in backlog.md',
    inputSchema: schema,
  },
  execute,
};
