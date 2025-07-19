import { exec } from 'child_process';

const definition = {
  name: 'viewTask',
  description: 'View a task in backlog.md',
  inputSchema: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        description: 'The ID of the task to view',
      },
      plain: {
        type: 'boolean',
        description: 'View in plain mode for AI',
      },
    },
    required: ['id'],
  },
};

async function execute(args: any): Promise<string> {
  let command = `backlog task ${args.id}`;
  if (args.plain) command += ` --plain`;

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
