/**
 * @file viewTask.ts
 * @description Defines the MCP tool for viewing a task in backlog.md.
 * This tool maps directly to the `backlog task <id>` CLI command.
 */
import { exec } from 'child_process';

/**
 * @description The definition of the `viewTask` tool.
 * This object describes the tool's name, description, and input schema,
 * which corresponds to the various flags of the CLI command.
 */
const definition = {
  name: 'viewTask',
  description: 'View a task in backlog.md',
  inputSchema: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        description: 'The ID of the task to view',
      },
      plain: {
        type: 'boolean',
        description: 'View in plain mode for AI',
      },
    },
    required: ['id'],
  },
};

/**
 * @description Executes the `viewTask` tool.
 * This function receives the arguments, constructs the `backlog task <id>`
 * command string with all the provided options, and executes it using
 * `child_process.exec`.
 * @param {any} args - The arguments for the tool, matching the inputSchema.
 * @returns {Promise<string>} A promise that resolves with the command's stdout
 * or rejects with an error.
 */
async function execute(args: any): Promise<string> {
  let command = `backlog task ${args.id}`;
  if (args.plain) command += ` --plain`;

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
