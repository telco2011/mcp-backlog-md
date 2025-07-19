/**
 * @file createDoc.ts
 * @description Defines the MCP tool for creating a new document in backlog.md.
 * This tool maps directly to the `backlog doc create` CLI command.
 */
import { exec } from 'child_process';

/**
 * @description The definition of the `createDoc` tool.
 * This object describes the tool's name, description, and input schema,
 * which corresponds to the various flags of the CLI command.
 */
const definition = {
  name: 'createDoc',
  description: 'Create a new document in backlog.md',
  inputSchema: {
    type: 'object',
    properties: {
      title: {
        type: 'string',
        description: 'The title of the document',
      },
      path: {
        type: 'string',
        description: 'The path to create the document in',
      },
      type: {
        type: 'string',
        description: 'The type of the document',
      },
    },
    required: ['title'],
  },
};

/**
 * @description Executes the `createDoc` tool.
 * This function receives the arguments, constructs the `backlog doc create`
 * command string with all the provided options, and executes it using
 * `child_process.exec`.
 * @param {any} args - The arguments for the tool, matching the inputSchema.
 * @returns {Promise<string>} A promise that resolves with the command's stdout
 * or rejects with an error.
 */
async function execute(args: any): Promise<string> {
  let command = `backlog doc create "${args.title}"`;
  if (args.path) command += ` -p ${args.path}`;
  if (args.type) command += ` -t ${args.type}`;

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
