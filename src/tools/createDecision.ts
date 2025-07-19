import { exec } from 'child_process';

const definition = {
  name: 'createDecision',
  description: 'Create a new decision in backlog.md',
  inputSchema: {
    type: 'object',
    properties: {
      title: {
        type: 'string',
        description: 'The title of the decision',
      },
      status: {
        type: 'string',
        description: 'The status of the decision',
      },
    },
    required: ['title'],
  },
};

async function execute(args: any): Promise<string> {
  let command = `backlog decision create "${args.title}"`;
  if (args.status) command += ` -s ${args.status}`;

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
