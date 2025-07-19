/**
 * @file createDecision.ts
 * @description Defines the MCP tool for creating a new decision in backlog.md.
 * This tool maps directly to the `backlog decision create` CLI command.
 */
import { exec } from 'child_process';

/**
 * @description The definition of the `createDecision` tool.
 * This object describes the tool's name, description, and input schema.
 */
const definition = {
  name: 'createDecision',
  description: 'Create a new decision in backlog.md',
  inputSchema: {
    type: 'object',
    properties: {
      title: {
        type: 'string',
        description: 'The title of the decision',
      },
      status: {
        type: 'string',
        description: 'The status of the decision',
      },
    },
    required: ['title'],
  },
};

/**
 * @description Executes the `createDecision` tool.
 * This function receives the arguments, constructs the `backlog decision create`
 * command string with all the provided options, and executes it using
 * `child_process.exec`.
 * @param {any} args - The arguments for the tool, matching the inputSchema.
 * @returns {Promise<string>} A promise that resolves with the command's stdout
 * or rejects with an error.
 */
async function execute(args: any): Promise<string> {
  let command = `backlog decision create "${args.title}"`;
  if (args.status) command += ` -s ${args.status}`;

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
