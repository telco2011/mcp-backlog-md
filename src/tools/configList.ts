/**
 * @file configList.ts
 * @description Defines the MCP tool for listing the configuration in backlog.md.
 * This tool maps directly to the `backlog config list` CLI command.
 */
import { exec } from 'child_process';

/**
 * @description The definition of the `configList` tool.
 * This object describes the tool's name, description, and input schema.
 */
const definition = {
  name: 'configList',
  description: 'List the configuration in backlog.md',
  inputSchema: {
    type: 'object',
    properties: {},
  },
};

/**
 * @description Executes the `configList` tool.
 * This function constructs and executes the `backlog config list`
 * command string using `child_process.exec`.
 * @returns {Promise<string>} A promise that resolves with the command's stdout
 * or rejects with an error.
 */
async function execute(): Promise<string> {
  const command = `backlog config list`;

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
