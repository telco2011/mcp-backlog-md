/**
 * exportBoard.ts
 *
 * Purpose:
 * - Provides the functionality to export the Kanban board to a markdown file.
 * - Exposes this functionality as an MCP tool.
 *
 * Logic Overview:
 * - Defines a Zod schema for input validation.
 * - The `execute` function constructs a `backlog export board` command.
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

const name = 'exportBoard';
const schema = {
  file: z.string().optional().describe('The file to export to'),
  force: z.boolean().optional().describe('Force overwrite of existing file'),
  readme: z.boolean().optional().describe('Export to README.md with markers'),
  exportVersion: z.string().optional().describe('Version to include in the export'),
  ...withProjectPath.shape,
};
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const zSchema = z.object(schema);

async function execute(params: z.infer<typeof zSchema>): Promise<CallToolResult> {
  console.info('Exporting board', params);
  let command = `${backlogCommand} export board`;
  if (params.file) command += ` --file ${params.file}`;
  if (params.force) command += ` --force`;
  if (params.readme) command += ` --readme`;
  if (params.exportVersion) command += ` --export-version ${params.exportVersion}`;

  return executeCommand({
    command,
    successMessage: 'Board exported successfully',
    projectPath: params.projectPath,
  });
}

export default {
  definition: {
    name,
    title: changeCase.capitalCase(name),
    description: 'Export the Kanban board to a markdown file',
    inputSchema: schema,
  },
  execute,
};
