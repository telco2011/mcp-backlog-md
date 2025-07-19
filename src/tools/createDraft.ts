import { exec } from 'child_process';

const definition = {
  name: 'createDraft',
  description: 'Create a draft task in backlog.md',
  inputSchema: {
    type: 'object',
    properties: {
      title: {
        type: 'string',
        description: 'The title of the draft',
      },
    },
    required: ['title'],
  },
};

async function execute(args: any): Promise<string> {
  const command = `backlog draft create "${args.title}"`;

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
