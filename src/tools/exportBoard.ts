/**
 * @file exportBoard.ts
 * @description Defines the MCP tool for exporting the Kanban board to a markdown file in backlog.md.
 * This tool maps directly to the `backlog board export` CLI command.
 */
import { exec } from 'child_process';

/**
 * @description The definition of the `exportBoard` tool.
 * This object describes the tool's name, description, and input schema.
 */
const definition = {
  name: 'exportBoard',
  description: 'Export the Kanban board to a markdown file',
  inputSchema: {
    type: 'object',
    properties: {
      file: {
        type: 'string',
        description: 'The file to export to',
      },
      force: {
        type: 'boolean',
        description: 'Force overwrite of existing file',
      },
    },
  },
};

/**
 * @description Executes the `exportBoard` tool.
 * This function receives the arguments, constructs the `backlog board export`
 * command string with all the provided options, and executes it using
 * `child_process.exec`.
 * @param {any} args - The arguments for the tool, matching the inputSchema.
 * @returns {Promise<string>} A promise that resolves with the command's stdout
 * or rejects with an error.
 */
async function execute(args: any): Promise<string> {
  let command = `backlog board export`;
  if (args.file) command += ` ${args.file}`;
  if (args.force) command += ` --force`;

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
