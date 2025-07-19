import { exec } from 'child_process';

const definition = {
  name: 'viewDoc',
  description: 'View a document in backlog.md',
  inputSchema: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        description: 'The ID of the document to view',
      },
    },
    required: ['id'],
  },
};

async function execute(args: any): Promise<string> {
  const command = `backlog doc view ${args.id}`;

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
