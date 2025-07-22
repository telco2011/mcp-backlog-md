import * as changeCase from 'change-case';

import { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { executeCommand } from '../lib/commandExecutor.js';
/**
 * @file createTask.ts
 * @description Defines the MCP tool for creating a new task in backlog.md.
 * This tool maps directly to the `backlog task create` CLI command.
 *
 * Last Updated:
 * 2025-07-21 by Cline (Refactored to use centralized command executor and unified schema)
 */
import { z } from 'zod';

const name = 'createTask';

// Use the centralized task schema
const schema = {
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  assignee: z.string().optional(),
  status: z.string().optional(),
  labels: z.string().optional(),
  priority: z.string().optional(),
  plan: z.string().optional(),
  ac: z.string().optional(),
  notes: z.string().optional(),
  dep: z.string().optional(),
  parent: z.string().optional(),
  draft: z.boolean().optional(),
};

export const zSchema = z.object(schema);

async function execute(
  params: z.infer<typeof zSchema>
): Promise<CallToolResult> {
  let command = `backlog task create "${params.title}"`;
  if (params.description) command += ` --description "${params.description}"`;
  if (params.assignee) command += ` --assignee "${params.assignee}"`;
  if (params.status) command += ` --status "${params.status}"`;
  // The CLI expects a comma-separated string for labels
  if (params.labels) command += ` --labels ${params.labels}`;
  if (params.priority) command += ` --priority ${params.priority}`;
  if (params.plan) command += ` --plan "${params.plan}"`;
  if (params.ac) command += ` --ac "${params.ac}"`;
  if (params.notes) command += ` --notes "${params.notes}"`;
  if (params.dep) command += ` --dep ${params.dep}`;
  if (params.parent) command += ` --parent ${params.parent}`;
  if (params.draft) command += ` --draft`;

  return executeCommand(command, 'Task created successfully');
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
