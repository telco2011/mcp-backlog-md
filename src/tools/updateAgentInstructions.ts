import { exec } from 'child_process';

const definition = {
  name: 'updateAgentInstructions',
  description: 'Update agent instruction files in backlog.md',
  inputSchema: {
    type: 'object',
    properties: {},
  },
};

async function execute(): Promise<string> {
  const command = `backlog agents --update-instructions`;

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
