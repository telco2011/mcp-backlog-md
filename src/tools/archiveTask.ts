/**
 * @file archiveTask.ts
 * @description Defines the MCP tool for archiving a task in backlog.md.
 * This tool maps directly to the `backlog task archive` CLI command.
 */
import { exec } from 'child_process';

/**
 * @description The definition of the `archiveTask` tool.
 * This object describes the tool's name, description, and input schema.
 */
const definition = {
  name: 'archiveTask',
  description: 'Archive a task in backlog.md',
  inputSchema: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        description: 'The ID of the task to archive',
      },
    },
    required: ['id'],
  },
};

/**
 * @description Executes the `archiveTask` tool.
 * This function receives the task ID, constructs the `backlog task archive`
 * command string, and executes it using `child_process.exec`.
 * @param {any} args - The arguments for the tool, matching the inputSchema.
 * @returns {Promise<string>} A promise that resolves with the command's stdout
 * or rejects with an error.
 */
async function execute(args: any): Promise<string> {
  const command = `backlog task archive ${args.id}`;

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
