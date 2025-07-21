import * as changeCase from "change-case";

import { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { executeCommand } from '../lib/commandExecutor.js';
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

const schema = {
  port: z.number().optional().describe('The port to launch the web UI on'),
  noOpen: z
    .boolean()
    .optional()
    .describe("Don't open the browser automatically"),
};
const zSchema = z.object(schema);

async function execute(params: z.infer<typeof zSchema>): Promise<CallToolResult> {
  let command = `backlog browser`;
  if (params.port) command += ` --port ${params.port}`;
  if (params.noOpen) command += ` --no-open`;

  return executeCommand(command, 'Browser launched successfully');
}

export default {
  definition: {
    name: 'browser',
    title: changeCase.capitalCase('browser'),
    description: 'Launch the web UI for backlog.md',
    inputSchema: schema,
  },
  execute,
};
