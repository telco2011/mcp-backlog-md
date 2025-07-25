/**
 * @file createTask.ts
 * @description Defines the MCP tool for creating a new task in backlog.md.
 * This tool maps directly to the `backlog task create` CLI command.
 *
 * Last Updated:
 * 2025-07-21 by Cline (Refactored to use centralized command executor and unified schema)
 */
import * as changeCase from 'change-case';

import { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { backlogCommand } from '../lib/utils.js';
import { executeCommand } from '../lib/commandExecutor.js';
import { withProjectPath } from '../lib/schemas.js';
import { z } from 'zod';

const name = 'createTask';

// Use the centralized task schema
const schema = {
  title: z.string().min(1, 'Title is required').describe('The title of the task.'),
  description: z.string().optional().describe('The description of the task.'),
  assignee: z.string().optional().describe('The assignee of the task.'),
  status: z.string().optional().describe('The status of the task.'),
  labels: z.string().optional().describe('Comma-separated list of labels for the task.'),
  priority: z.string().optional().describe('The priority of the task (high, medium, low).'),
  acceptanceCriteria: z.string().optional().describe('Comma-separated list of acceptance criteria.'),
  plan: z.string().optional().describe('The implementation plan for the task.'),
  notes: z.string().optional().describe('Implementation notes for the task.'),
  draft: z.boolean().optional().describe('Create the task as a draft.'),
  parent: z.string().optional().describe('The parent task ID.'),
  dependsOn: z.string().optional().describe('Comma-separated list of task dependencies.'),
  ...withProjectPath.shape,
};

export const zSchema = z.object(schema);

async function execute(params: z.infer<typeof zSchema>): Promise<CallToolResult> {
  console.info('Creating task', params);
  let command = `${backlogCommand} task create "${params.title}"`;
  if (params.description) command += ` --description "${params.description}"`;
  if (params.assignee) command += ` --assignee "${params.assignee}"`;
  if (params.status) command += ` --status "${params.status}"`;
  // The CLI expects a comma-separated string for labels
  if (params.labels) command += ` --labels "${params.labels}"`;
  if (params.priority) command += ` --priority ${params.priority}`;
  if (params.plan) command += ` --plan "${params.plan}"`;
  if (params.acceptanceCriteria) command += ` --ac "${params.acceptanceCriteria}"`;
  if (params.notes) command += ` --notes "${params.notes}"`;
  if (params.dependsOn) command += ` --dep "${params.dependsOn}"`;
  if (params.parent) command += ` --parent ${params.parent}`;
  if (params.draft) command += ` --draft`;

  return executeCommand({
    command,
    successMessage: 'Task created successfully',
    projectPath: params.projectPath,
  });
}

export default {
  definition: {
    name,
    title: changeCase.capitalCase(name),
    description: 'Create a new task in backlog.md',
    inputSchema: schema,
  },
  execute,
};
