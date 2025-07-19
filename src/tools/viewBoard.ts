/**
 * @file viewBoard.ts
 * @description Defines the MCP tool for viewing the Kanban board in backlog.md.
 * This tool maps directly to the `backlog board` CLI command.
 */
import { exec } from 'child_process';

/**
 * @description The definition of the `viewBoard` tool.
 * This object describes the tool's name, description, and input schema.
 */
const definition = {
  name: 'viewBoard',
  description: 'View the Kanban board in backlog.md',
  inputSchema: {
    type: 'object',
    properties: {},
  },
};

/**
 * @description Executes the `viewBoard` tool.
 * This function constructs and executes the `backlog board` command string
 * using `child_process.exec`.
 * @returns {Promise<string>} A promise that resolves with the command's stdout
 * or rejects with an error.
 */
async function execute(): Promise<string> {
  const command = `backlog board`;

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
