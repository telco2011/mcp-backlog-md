/**
 * @file listDocs.ts
 * @description Defines the MCP tool for listing documents in backlog.md.
 * This tool maps directly to the `backlog doc list` CLI command.
 */
import { exec } from 'child_process';

/**
 * @description The definition of the `listDocs` tool.
 * This object describes the tool's name, description, and input schema.
 */
const definition = {
  name: 'listDocs',
  description: 'List documents in backlog.md',
  inputSchema: {
    type: 'object',
    properties: {},
  },
};

/**
 * @description Executes the `listDocs` tool.
 * This function constructs and executes the `backlog doc list`
 * command string using `child_process.exec`.
 * @returns {Promise<string>} A promise that resolves with the command's stdout
 * or rejects with an error.
 */
async function execute(): Promise<string> {
  const command = `backlog doc list`;

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
