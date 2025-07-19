/**
 * @file configSet.ts
 * @description Defines the MCP tool for setting a configuration value in backlog.md.
 * This tool maps directly to the `backlog config set` CLI command.
 */
import { exec } from 'child_process';

/**
 * @description The definition of the `configSet` tool.
 * This object describes the tool's name, description, and input schema.
 */
const definition = {
  name: 'configSet',
  description: 'Set a configuration value in backlog.md',
  inputSchema: {
    type: 'object',
    properties: {
      key: {
        type: 'string',
        description: 'The configuration key to set',
      },
      value: {
        type: 'string',
        description: 'The value to set for the configuration key',
      },
    },
    required: ['key', 'value'],
  },
};

/**
 * @description Executes the `configSet` tool.
 * This function receives the key and value, constructs the `backlog config set`
 * command string, and executes it using `child_process.exec`.
 * @param {any} args - The arguments for the tool, matching the inputSchema.
 * @returns {Promise<string>} A promise that resolves with the command's stdout
 * or rejects with an error.
 */
async function execute(args: any): Promise<string> {
  const command = `backlog config set ${args.key} "${args.value}"`;

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
