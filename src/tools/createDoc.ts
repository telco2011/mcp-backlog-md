import { exec } from 'child_process';

const definition = {
  name: 'createDoc',
  description: 'Create a new document in backlog.md',
  inputSchema: {
    type: 'object',
    properties: {
      title: {
        type: 'string',
        description: 'The title of the document',
      },
      path: {
        type: 'string',
        description: 'The path to create the document in',
      },
      type: {
        type: 'string',
        description: 'The type of the document',
      },
    },
    required: ['title'],
  },
};

async function execute(args: any): Promise<string> {
  let command = `backlog doc create "${args.title}"`;
  if (args.path) command += ` -p ${args.path}`;
  if (args.type) command += ` -t ${args.type}`;

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
