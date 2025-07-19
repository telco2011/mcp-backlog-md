import { exec } from 'child_process';

const definition = {
  name: 'configList',
  description: 'List the configuration in backlog.md',
  inputSchema: {
    type: 'object',
    properties: {},
  },
};

async function execute(): Promise<string> {
  const command = `backlog config list`;

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
