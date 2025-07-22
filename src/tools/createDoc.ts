import * as changeCase from 'change-case';

import { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { executeCommand } from '../lib/commandExecutor.js';
/**
 * createDoc.ts
 *
 * Purpose:
 * - Provides the functionality to create a new document in the backlog.
 * - Exposes this functionality as an MCP tool.
 *
 * Logic Overview:
 * - Defines a Zod schema for input validation.
 * - The `execute` function constructs a `backlog doc create` command.
 * - The command is passed to the centralized `executeCommand` function.
 *
 * Last Updated:
 * 2025-07-21 by Cline (Refactored to use centralized command executor)
 */
import { z } from 'zod';

const schema = {
  title: z.string().describe('The title of the document'),
  path: z.string().optional().describe('The path to create the document in'),
  type: z.string().optional().describe('The type of the document'),
};
const zSchema = z.object(schema);

async function execute(
  params: z.infer<typeof zSchema>
): Promise<CallToolResult> {
  let command = `backlog doc create "${params.title}"`;
  if (params.path) command += ` --path "${params.path}"`;
  if (params.type) command += ` --type "${params.type}"`;

  return executeCommand(command, 'Document created successfully');
}

export default {
  definition: {
    name: 'createDoc',
    title: changeCase.capitalCase('createDoc'),
    description: 'Create a new document in backlog.md',
    inputSchema: schema,
  },
  execute,
};
