import { exec } from 'child_process';

const definition = {
  name: 'demoteTask',
  description: 'Demote a task to a draft in backlog.md',
  inputSchema: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        description: 'The ID of the task to demote',
      },
    },
    required: ['id'],
  },
};

async function execute(args: any): Promise<string> {
  const command = `backlog task demote ${args.id}`;

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
