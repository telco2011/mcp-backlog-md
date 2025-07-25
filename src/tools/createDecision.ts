/**
 * createDecision.ts
 *
 * Purpose:
 * - Provides the functionality to create a new decision in the backlog.
 * - Exposes this functionality as an MCP tool.
 *
 * Logic Overview:
 * - Defines a Zod schema for input validation.
 * - The `execute` function constructs a `backlog decision create` command.
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

const name = 'createDecision';
const schema = {
  title: z.string().describe('The title of the decision'),
  status: z.string().optional().describe('The status of the decision'),
  ...withProjectPath.shape,
};
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const zSchema = z.object(schema);

async function execute(params: z.infer<typeof zSchema>): Promise<CallToolResult> {
  console.info('Creating decision', params);
  let command = `${backlogCommand} decision create "${params.title}"`;
  if (params.status) command += ` --status "${params.status}"`;

  return executeCommand({
    command,
    successMessage: 'Decision created successfully',
    projectPath: params.projectPath,
  });
}

export default {
  definition: {
    name,
    title: changeCase.capitalCase(name),
    description: 'Create a new decision in backlog.md',
    inputSchema: schema,
  },
  execute,
};
