/**
 * @file updateAgentInstructions.ts
 * @description Defines the MCP tool for updating agent instruction files in backlog.md.
 * This tool maps directly to the `backlog agents --update-instructions` CLI command.
 */
import { exec } from 'child_process';

/**
 * @description The definition of the `updateAgentInstructions` tool.
 * This object describes the tool's name, description, and input schema.
 */
const definition = {
  name: 'updateAgentInstructions',
  description: 'Update agent instruction files in backlog.md',
  inputSchema: {
    type: 'object',
    properties: {},
  },
};

/**
 * @description Executes the `updateAgentInstructions` tool.
 * This function constructs and executes the `backlog agents --update-instructions`
 * command string using `child_process.exec`.
 * @returns {Promise<string>} A promise that resolves with the command's stdout
 * or rejects with an error.
 */
async function execute(): Promise<string> {
  const command = `backlog agents --update-instructions`;

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
