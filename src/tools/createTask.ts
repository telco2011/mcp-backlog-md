import { executeCommand } from '../lib/commandExecutor';
import { taskSchema } from '../lib/zodSchemas';
/**
 * @file createTask.ts
 * @description Defines the MCP tool for creating a new task in backlog.md.
 * This tool maps directly to the `backlog task create` CLI command.
 *
 * Last Updated:
 * 2025-07-21 by Cline (Refactored to use centralized command executor and unified schema)
 */
import { z } from 'zod';

// Use the centralized task schema
const schema = taskSchema;

async function execute(params: z.infer<typeof schema>): Promise<string> {
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
    name: 'createTask',
    description: 'Create a new task in backlog.md',
    input_schema: schema,
  },
  execute,
};
