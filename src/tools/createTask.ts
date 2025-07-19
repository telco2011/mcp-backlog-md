/**
 * @file createTask.ts
 * @description Defines the MCP tool for creating a new task in backlog.md.
 * This tool maps directly to the `backlog task create` CLI command.
 */
import { exec } from 'child_process';

/**
 * @description The definition of the `createTask` tool.
 * This object describes the tool's name, description, and input schema,
 * which corresponds to the various flags of the CLI command.
 */
const definition = {
  name: 'createTask',
  description: 'Create a new task in backlog.md',
  inputSchema: {
    type: 'object',
    properties: {
      title: {
        type: 'string',
        description: 'The title of the task',
      },
      description: {
        type: 'string',
        description: 'The description of the task',
      },
      assignee: {
        type: 'string',
        description: 'The assignee of the task',
      },
      status: {
        type: 'string',
        description: 'The status of the task',
      },
      labels: {
        type: 'string',
        description: 'Comma-separated list of labels',
      },
      priority: {
        type: 'string',
        description: 'The priority of the task',
      },
      plan: {
        type: 'string',
        description: 'The plan for the task',
      },
      ac: {
        type: 'string',
        description: 'Acceptance criteria for the task',
      },
      notes: {
        type: 'string',
        description: 'Notes for the task',
      },
      dep: {
        type: 'string',
        description: 'Comma-separated list of dependencies',
      },
      parent: {
        type: 'string',
        description: 'The parent task ID',
      },
      draft: {
        type: 'boolean',
        description: 'Create the task as a draft',
      },
    },
    required: ['title'],
  },
};

/**
 * @description Executes the `createTask` tool.
 * This function receives the arguments, constructs the `backlog task create`
 * command string with all the provided options, and executes it using
 * `child_process.exec`.
 * @param {any} args - The arguments for the tool, matching the inputSchema.
 * @returns {Promise<string>} A promise that resolves with the command's stdout
 * or rejects with an error.
 */
async function execute(args: any): Promise<string> {
  let command = `backlog task create "${args.title}"`;
  if (args.description) command += ` -d "${args.description}"`;
  if (args.assignee) command += ` -a ${args.assignee}`;
  if (args.status) command += ` -s "${args.status}"`;
  if (args.labels) command += ` -l ${args.labels}`;
  if (args.priority) command += ` --priority ${args.priority}`;
  if (args.plan) command += ` --plan "${args.plan}"`;
  if (args.ac) command += ` --ac "${args.ac}"`;
  if (args.notes) command += ` --notes "${args.notes}"`;
  if (args.dep) command += ` --dep ${args.dep}`;
  if (args.parent) command += ` -p ${args.parent}`;
  if (args.draft) command += ` --draft`;

  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(new Error(stderr || error.message));
      } else {
        resolve(stdout);
      }
    });
  });
}

export default {
  definition,
  execute,
};
