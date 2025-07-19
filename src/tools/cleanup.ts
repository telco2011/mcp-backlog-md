import { exec } from 'child_process';

const definition = {
  name: 'cleanup',
  description: 'Cleanup done tasks in backlog.md',
  inputSchema: {
    type: 'object',
    properties: {},
  },
};

async function execute(): Promise<string> {
  const command = `backlog cleanup`;

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
