/**
 * @file cleanup.ts
 * @description Defines the MCP tool for cleaning up done tasks in backlog.md.
 * This tool maps directly to the `backlog cleanup` CLI command.
 */
import { exec } from 'child_process';

/**
 * @description The definition of the `cleanup` tool.
 * This object describes the tool's name, description, and input schema.
 */
const definition = {
  name: 'cleanup',
  description: 'Cleanup done tasks in backlog.md',
  inputSchema: {
    type: 'object',
    properties: {},
  },
};

/**
 * @description Executes the `cleanup` tool.
 * This function constructs and executes the `backlog cleanup`
 * command string using `child_process.exec`.
 * @returns {Promise<string>} A promise that resolves with the command's stdout
 * or rejects with an error.
 */
async function execute(): Promise<string> {
  const command = `backlog cleanup`;

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
