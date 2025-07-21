import * as changeCase from "change-case";

import { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { executeCommand } from '../lib/commandExecutor.js';
/**
 * viewDoc.ts
 *
 * Purpose:
 * - Provides the functionality to view a document in the backlog.
 * - Exposes this functionality as an MCP tool.
 *
 * Logic Overview:
 * - Defines a Zod schema for input validation.
 * - The `execute` function constructs a `backlog doc view` command.
 * - The command is passed to the centralized `executeCommand` function.
 *
 * Last Updated:
 * 2025-07-21 by Cline (Refactored to use centralized command executor)
 */
import { z } from 'zod';

const schema = {
  id: z.string().describe('The ID of the document to view'),
};
const zSchema = z.object(schema);

async function execute(params: z.infer<typeof zSchema>): Promise<CallToolResult> {
  const command = `backlog doc view ${params.id}`;
  return executeCommand(command, 'Document viewed successfully');
}

export default {
  definition: {
    name: 'viewDoc',
    title: changeCase.capitalCase('viewDoc'),
    description: 'View a document in backlog.md',
    inputSchema: schema,
  },
  execute,
};
