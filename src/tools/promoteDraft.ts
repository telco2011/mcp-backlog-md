import * as changeCase from 'change-case';

import { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { executeCommand } from '../lib/commandExecutor.js';
/**
 * promoteDraft.ts
 *
 * Purpose:
 * - Provides the functionality to promote a draft to a task in the backlog.
 * - Exposes this functionality as an MCP tool.
 *
 * Logic Overview:
 * - Defines a Zod schema for input validation.
 * - The `execute` function constructs a `backlog draft promote` command.
 * - The command is passed to the centralized `executeCommand` function.
 *
 * Last Updated:
 * 2025-07-21 by Cline (Refactored to use centralized command executor)
 */
import { z } from 'zod';

const name = 'promoteDraft';
const schema = {
  id: z.string().describe('The ID of the draft to promote'),
};
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const zSchema = z.object(schema);

async function execute(
  params: z.infer<typeof zSchema>
): Promise<CallToolResult> {
  console.info('Promoting draft', params);
  const command = `backlog draft promote ${params.id}`;
  return executeCommand(command, 'Draft promoted successfully');
}

export default {
  definition: {
    name,
    title: changeCase.capitalCase(name),
    description: 'Promote a draft to a task in backlog.md',
    inputSchema: schema,
  },
  execute,
};
