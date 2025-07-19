import { exec } from 'child_process';

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
