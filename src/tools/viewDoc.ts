/**
 * @file viewDoc.ts
 * @description Defines the MCP tool for viewing a document in backlog.md.
 * This tool maps directly to the `backlog doc view` CLI command.
 */
import { exec } from 'child_process';

/**
 * @description The definition of the `viewDoc` tool.
 * This object describes the tool's name, description, and input schema.
 */
const definition = {
  name: 'viewDoc',
  description: 'View a document in backlog.md',
  inputSchema: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        description: 'The ID of the document to view',
      },
    },
    required: ['id'],
  },
};

/**
 * @description Executes the `viewDoc` tool.
 * This function receives the document ID, constructs the `backlog doc view`
 * command string, and executes it using `child_process.exec`.
 * @param {any} args - The arguments for the tool, matching the inputSchema.
 * @returns {Promise<string>} A promise that resolves with the command's stdout
 * or rejects with an error.
 */
async function execute(args: any): Promise<string> {
  const command = `backlog doc view ${args.id}`;

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
