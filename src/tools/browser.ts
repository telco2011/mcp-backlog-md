/**
 * @file browser.ts
 * @description Defines the MCP tool for launching the web UI for backlog.md.
 * This tool maps directly to the `backlog browser` CLI command.
 */
import { exec } from 'child_process';

/**
 * @description The definition of the `browser` tool.
 * This object describes the tool's name, description, and input schema.
 */
const definition = {
  name: 'browser',
  description: 'Launch the web UI for backlog.md',
  inputSchema: {
    type: 'object',
    properties: {
      port: {
        type: 'number',
        description: 'The port to launch the web UI on',
      },
      noOpen: {
        type: 'boolean',
        description: "Don't open the browser automatically",
      },
    },
  },
};

/**
 * @description Executes the `browser` tool.
 * This function receives the arguments, constructs the `backlog browser`
 * command string with all the provided options, and executes it using
 * `child_process.exec`.
 * @param {any} args - The arguments for the tool, matching the inputSchema.
 * @returns {Promise<string>} A promise that resolves with the command's stdout
 * or rejects with an error.
 */
async function execute(args: any): Promise<string> {
  let command = `backlog browser`;
  if (args.port) command += ` --port ${args.port}`;
  if (args.noOpen) command += ` --no-open`;

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
