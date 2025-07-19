import { exec } from 'child_process';

const definition = {
  name: 'archiveTask',
  description: 'Archive a task in backlog.md',
  inputSchema: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        description: 'The ID of the task to archive',
      },
    },
    required: ['id'],
  },
};

async function execute(args: any): Promise<string> {
  const command = `backlog task archive ${args.id}`;

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
