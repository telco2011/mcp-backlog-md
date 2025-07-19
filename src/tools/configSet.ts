import { exec } from 'child_process';

const definition = {
  name: 'configSet',
  description: 'Set a configuration value in backlog.md',
  inputSchema: {
    type: 'object',
    properties: {
      key: {
        type: 'string',
        description: 'The configuration key to set',
      },
      value: {
        type: 'string',
        description: 'The value to set for the configuration key',
      },
    },
    required: ['key', 'value'],
  },
};

async function execute(args: any): Promise<string> {
  const command = `backlog config set ${args.key} "${args.value}"`;

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
