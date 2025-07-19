/**
 * @file promoteDraft.ts
 * @description Defines the MCP tool for promoting a draft to a task in backlog.md.
 * This tool maps directly to the `backlog draft promote` CLI command.
 */
import { exec } from 'child_process';

/**
 * @description The definition of the `promoteDraft` tool.
 * This object describes the tool's name, description, and input schema.
 */
const definition = {
  name: 'promoteDraft',
  description: 'Promote a draft to a task in backlog.md',
  inputSchema: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        description: 'The ID of the draft to promote',
      },
    },
    required: ['id'],
  },
};

/**
 * @description Executes the `promoteDraft` tool.
 * This function receives the draft ID, constructs the `backlog draft promote`
 * command string, and executes it using `child_process.exec`.
 * @param {any} args - The arguments for the tool, matching the inputSchema.
 * @returns {Promise<string>} A promise that resolves with the command's stdout
 * or rejects with an error.
 */
async function execute(args: any): Promise<string> {
  const command = `backlog draft promote ${args.id}`;

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
