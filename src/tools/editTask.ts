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
  desc: z.string().optional().describe('Alternative description field (alias for description)'),
  ordinal: z.number().optional().describe('Task ordering position'),
  assignee: z.string().optional().describe('The new assignee of the task'),
  status: z.string().optional().describe('The new status of the task'),
  label: z.string().optional().describe('Replace all existing labels with a new comma-separated list of labels'),
  priority: z.string().optional().describe('The new priority for the task (high, medium, low)'),
  addLabel: z.string().optional().describe('Add a new label to the task'),
  removeLabel: z.string().optional().describe('Remove a label from the task'),
  acceptanceCriteria: z.string().optional().describe('Replace all existing acceptance criteria with new criteria (comma-separated)'),
  addAc: z.string().optional().describe('Add new acceptance criteria (equivalent to using multiple --ac flags)'),
  checkAc: z.number().optional().describe('Mark acceptance criteria as completed by index number (1-based)'),
  unCheckAc: z.number().optional().describe('Mark acceptance criteria as not completed by index number (1-based)'),
  removeAc: z.number().optional().describe('Remove acceptance criteria by index number (1-based)'),
  plan: z.string().optional().describe('The new implementation plan for the task'),
  notes: z.string().optional().describe('New implementation notes for the task'),
  dependsOn: z.string().optional().describe('Replace all existing task dependencies with new comma-separated list of task IDs'),
  parent: z.string().optional().describe('Set or change the parent task ID'),
  ...withProjectPath.shape,
};

const _zSchema = z.object(schema);

async function execute(params: z.infer<typeof _zSchema>): Promise<CallToolResult> {
  console.info('Editing task', params);
  let command = `${backlogCommand} task edit ${params.id}`;
  if (params.title) command += ` --title "${params.title}"`;
  if (params.description) command += ` --description "${params.description}"`;
  if (params.desc) command += ` --desc "${params.desc}"`;
  if (params.ordinal) command += ` --ordinal ${params.ordinal}`;
  if (params.assignee) command += ` --assignee "${params.assignee}"`;
  if (params.status) command += ` --status "${params.status}"`;
  if (params.label) command += ` --label "${params.label}"`;
  if (params.priority) command += ` --priority ${params.priority}`;
  if (params.addLabel) command += ` --add-label "${params.addLabel}"`;
  if (params.removeLabel) command += ` --remove-label "${params.removeLabel}"`;
  if (params.acceptanceCriteria) command += ` --ac "${params.acceptanceCriteria}"`;
  if (params.addAc) command += ` --ac "${params.addAc}"`;
  if (params.checkAc) command += ` --check-ac ${params.checkAc}`;
  if (params.unCheckAc) command += ` --uncheck-ac ${params.unCheckAc}`;
  if (params.removeAc) command += ` --remove-ac ${params.removeAc}`;
  if (params.plan) command += ` --plan "${params.plan}"`;
  if (params.notes) command += ` --notes "${params.notes}"`;
  if (params.dependsOn) command += ` --dep "${params.dependsOn}"`;
  if (params.parent) command += ` --parent ${params.parent}`;

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
