import * as changeCase from 'change-case';

import { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { backlogCommand } from '../lib/utils.js';
import { executeCommand } from '../lib/commandExecutor.js';
import { withProjectPath } from '../lib/schemas.js';
/**
 * createDraft.ts
 *
 * Purpose:
 * - Provides the functionality to create a new draft task in the backlog.
 * - Exposes this functionality as an MCP tool.
 *
 * Logic Overview:
 * - Defines a Zod schema for input validation.
 * - The `execute` function constructs a `backlog draft create` command.
 * - The command is passed to the centralized `executeCommand` function.
 *
 * Last Updated:
 * 2025-07-21 by Cline (Refactored to use centralized command executor)
 */
import { z } from 'zod';

const name = 'createDraft';
const schema = {
  title: z.string().describe('The title of the draft'),
  description: z.string().optional().describe('The description of the draft.'),
  assignee: z.string().optional().describe('The assignee of the draft.'),
  status: z.string().optional().describe('The status of the draft.'),
  labels: z.string().optional().describe('Comma-separated list of labels for the draft.'),
  ...withProjectPath.shape,
};
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const zSchema = z.object(schema);

async function execute(params: z.infer<typeof zSchema>): Promise<CallToolResult> {
  console.info('Creating draft', params);
  let command = `${backlogCommand} draft create "${params.title}"`;
  if (params.description) command += ` --description "${params.description}"`;
  if (params.assignee) command += ` --assignee "${params.assignee}"`;
  if (params.status) command += ` --status "${params.status}"`;
  if (params.labels) command += ` --labels "${params.labels}"`;

  return executeCommand({
    command,
    successMessage: 'Draft created successfully',
    projectPath: params.projectPath,
  });
}

export default {
  definition: {
    name,
    title: changeCase.capitalCase(name),
    description: 'Create a draft task in backlog.md',
    inputSchema: schema,
  },
  execute,
};
