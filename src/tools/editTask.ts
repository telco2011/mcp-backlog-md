import * as changeCase from "change-case";

import { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { executeCommand } from '../lib/commandExecutor.js';
/**
 * editTask.ts
 *
 * Purpose:
 * - Provides the functionality to edit an existing task in the backlog.
 * - Exposes this functionality as an MCP tool.
 *
 * Logic Overview:
 * - Defines a Zod schema for input validation.
 * - The `execute` function constructs a `backlog task edit` command.
 * - The command is passed to the centralized `executeCommand` function.
 *
 * Last Updated:
 * 2025-07-21 by Cline (Refactored to use centralized command executor)
 */
import { z } from 'zod';

const schema = {
  id: z.string().describe('The ID of the task to edit'),
  assignee: z.string().optional().describe('The new assignee of the task'),
  labels: z
    .string()
    .optional()
    .describe('Comma-separated list of new labels'),
  plan: z.string().optional().describe('The new plan for the task'),
  ac: z.string().optional().describe('New acceptance criteria for the task'),
  notes: z.string().optional().describe('New notes for the task'),
  dep: z.string().optional().describe('Comma-separated list of new dependencies'),
};
const zSchema = z.object(schema);

async function execute(params: z.infer<typeof zSchema>): Promise<CallToolResult> {
  let command = `backlog task edit ${params.id}`;
  if (params.assignee) command += ` --assignee "${params.assignee}"`;
  if (params.labels) command += ` --labels ${params.labels}`;
  if (params.plan) command += ` --plan "${params.plan}"`;
  if (params.ac) command += ` --ac "${params.ac}"`;
  if (params.notes) command += ` --notes "${params.notes}"`;
  if (params.dep) command += ` --dep ${params.dep}`;

  return executeCommand(command, 'Task edited successfully');
}

export default {
  definition: {
    name: 'editTask',
    title: changeCase.capitalCase('editTask'),
    description: 'Edit an existing task in backlog.md',
    inputSchema: schema,
  },
  execute,
};
