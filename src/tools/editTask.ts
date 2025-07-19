/**
 * @file editTask.ts
 * @description Defines the MCP tool for editing an existing task in backlog.md.
 * This tool maps directly to the `backlog task edit` CLI command.
 */
import { exec } from 'child_process';

/**
 * @description The definition of the `editTask` tool.
 * This object describes the tool's name, description, and input schema,
 * which corresponds to the various flags of the CLI command.
 */
const definition = {
  name: 'editTask',
  description: 'Edit an existing task in backlog.md',
  inputSchema: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        description: 'The ID of the task to edit',
      },
      assignee: {
        type: 'string',
        description: 'The new assignee of the task',
      },
      labels: {
        type: 'string',
        description: 'Comma-separated list of new labels',
      },
      plan: {
        type: 'string',
        description: 'The new plan for the task',
      },
      ac: {
        type: 'string',
        description: 'New acceptance criteria for the task',
      },
      notes: {
        type: 'string',
        description: 'New notes for the task',
      },
      dep: {
        type: 'string',
        description: 'Comma-separated list of new dependencies',
      },
    },
    required: ['id'],
  },
};

/**
 * @description Executes the `editTask` tool.
 * This function receives the arguments, constructs the `backlog task edit`
 * command string with all the provided options, and executes it using
 * `child_process.exec`.
 * @param {any} args - The arguments for the tool, matching the inputSchema.
 * @returns {Promise<string>} A promise that resolves with the command's stdout
 * or rejects with an error.
 */
async function execute(args: any): Promise<string> {
  let command = `backlog task edit ${args.id}`;
  if (args.assignee) command += ` -a ${args.assignee}`;
  if (args.labels) command += ` -l ${args.labels}`;
  if (args.plan) command += ` --plan "${args.plan}"`;
  if (args.ac) command += ` --ac "${args.ac}"`;
  if (args.notes) command += ` --notes "${args.notes}"`;
  if (args.dep) command += ` --dep ${args.dep}`;

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
