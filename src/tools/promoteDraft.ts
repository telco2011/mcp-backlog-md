import { exec } from 'child_process';

const definition = {
  name: 'promoteDraft',
  description: 'Promote a draft to a task in backlog.md',
  inputSchema: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        description: 'The ID of the draft to promote',
      },
    },
    required: ['id'],
  },
};

async function execute(args: any): Promise<string> {
  const command = `backlog draft promote ${args.id}`;

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
