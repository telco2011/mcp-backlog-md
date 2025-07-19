/**
 * @file listTasks.ts
 * @description Defines the MCP tool for listing tasks in backlog.md.
 * This tool maps directly to the `backlog task list` CLI command.
 */
import { exec } from 'child_process';

/**
 * @description The definition of the `listTasks` tool.
 * This object describes the tool's name, description, and input schema,
 * which corresponds to the various flags of the CLI command.
 */
const definition = {
  name: 'listTasks',
  description: 'List tasks in backlog.md',
  inputSchema: {
    type: 'object',
    properties: {
      status: {
        type: 'string',
        description: 'Filter by status',
      },
      assignee: {
        type: 'string',
        description: 'Filter by assignee',
      },
      parent: {
        type: 'string',
        description: 'Filter by parent task ID',
      },
    },
  },
};

/**
 * @description Executes the `listTasks` tool.
 * This function receives the arguments, constructs the `backlog task list`
 * command string with all the provided options, and executes it using
 * `child_process.exec`.
 * @param {any} args - The arguments for the tool, matching the inputSchema.
 * @returns {Promise<string>} A promise that resolves with the command's stdout
 * or rejects with an error.
 */
async function execute(args: any): Promise<string> {
  let command = `backlog task list`;
  if (args.status) command += ` -s "${args.status}"`;
  if (args.assignee) command += ` -a ${args.assignee}`;
  if (args.parent) command += ` -p ${args.parent}`;

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
