/**
 * @file demoteTask.ts
 * @description Defines the MCP tool for demoting a task to a draft in backlog.md.
 * This tool maps directly to the `backlog task demote` CLI command.
 */
import { exec } from 'child_process';

/**
 * @description The definition of the `demoteTask` tool.
 * This object describes the tool's name, description, and input schema.
 */
const definition = {
  name: 'demoteTask',
  description: 'Demote a task to a draft in backlog.md',
  inputSchema: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        description: 'The ID of the task to demote',
      },
    },
    required: ['id'],
  },
};

/**
 * @description Executes the `demoteTask` tool.
 * This function receives the task ID, constructs the `backlog task demote`
 * command string, and executes it using `child_process.exec`.
 * @param {any} args - The arguments for the tool, matching the inputSchema.
 * @returns {Promise<string>} A promise that resolves with the command's stdout
 * or rejects with an error.
 */
async function execute(args: any): Promise<string> {
  const command = `backlog task demote ${args.id}`;

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
