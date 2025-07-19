/**
 * @file createDraft.ts
 * @description Defines the MCP tool for creating a draft task in backlog.md.
 * This tool maps directly to the `backlog draft create` CLI command.
 */
import { exec } from 'child_process';

/**
 * @description The definition of the `createDraft` tool.
 * This object describes the tool's name, description, and input schema.
 */
const definition = {
  name: 'createDraft',
  description: 'Create a draft task in backlog.md',
  inputSchema: {
    type: 'object',
    properties: {
      title: {
        type: 'string',
        description: 'The title of the draft',
      },
    },
    required: ['title'],
  },
};

/**
 * @description Executes the `createDraft` tool.
 * This function receives the title, constructs the `backlog draft create`
 * command string, and executes it using `child_process.exec`.
 * @param {any} args - The arguments for the tool, matching the inputSchema.
 * @returns {Promise<string>} A promise that resolves with the command's stdout
 * or rejects with an error.
 */
async function execute(args: any): Promise<string> {
  const command = `backlog draft create "${args.title}"`;

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
