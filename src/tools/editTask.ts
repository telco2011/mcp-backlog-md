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
import * as changeCase from 'change-case';

import { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { backlogCommand } from '../lib/utils.js';
import { executeCommand } from '../lib/commandExecutor.js';
import { withProjectPath } from '../lib/schemas.js';
import { z } from 'zod';

const name = 'editTask';
const schema = {
  id: z.string().describe('The ID of the task to edit'),
  title: z.string().optional().describe('The new title for the task'),
  description: z.string().optional().describe('The new description for the task'),
  assignee: z.string().optional().describe('The new assignee of the task'),
  status: z.string().optional().describe('The new status of the task'),
  label: z.string().optional().describe('Set a new comma-separated list of labels'),
  priority: z.string().optional().describe('The new priority for the task (high, medium, low)'),
  addLabel: z.string().optional().describe('Add a new label to the task'),
  removeLabel: z.string().optional().describe('Remove a label from the task'),
  acceptanceCriteria: z.string().optional().describe('Set new acceptance criteria (comma-separated)'),
  plan: z.string().optional().describe('The new implementation plan for the task'),
  notes: z.string().optional().describe('New implementation notes for the task'),
  dependsOn: z.string().optional().describe('Set a new comma-separated list of task dependencies'),
  ...withProjectPath.shape,
};
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const zSchema = z.object(schema);

async function execute(params: z.infer<typeof zSchema>): Promise<CallToolResult> {
  console.info('Editing task', params);
  let command = `${backlogCommand} task edit ${params.id}`;
  if (params.title) command += ` --title "${params.title}"`;
  if (params.description) command += ` --description "${params.description}"`;
  if (params.assignee) command += ` --assignee "${params.assignee}"`;
  if (params.status) command += ` --status "${params.status}"`;
  if (params.label) command += ` --label "${params.label}"`;
  if (params.priority) command += ` --priority ${params.priority}`;
  if (params.addLabel) command += ` --add-label "${params.addLabel}"`;
  if (params.removeLabel) command += ` --remove-label "${params.removeLabel}"`;
  if (params.acceptanceCriteria) command += ` --ac "${params.acceptanceCriteria}"`;
  if (params.plan) command += ` --plan "${params.plan}"`;
  if (params.notes) command += ` --notes "${params.notes}"`;
  if (params.dependsOn) command += ` --dep "${params.dependsOn}"`;

  return executeCommand({
    command,
    successMessage: 'Task edited successfully',
    projectPath: params.projectPath,
  });
}

export default {
  definition: {
    name,
    title: changeCase.capitalCase(name),
    description: 'Edit an existing task in backlog.md',
    inputSchema: schema,
  },
  execute,
};
