import { exec } from 'child_process';

const definition = {
  name: 'listDocs',
  description: 'List documents in backlog.md',
  inputSchema: {
    type: 'object',
    properties: {},
  },
};

async function execute(): Promise<string> {
  const command = `backlog doc list`;

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
