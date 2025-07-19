import { exec } from 'child_process';

const definition = {
  name: 'browser',
  description: 'Launch the web UI for backlog.md',
  inputSchema: {
    type: 'object',
    properties: {
      port: {
        type: 'number',
        description: 'The port to launch the web UI on',
      },
      noOpen: {
        type: 'boolean',
        description: "Don't open the browser automatically",
      },
    },
  },
};

async function execute(args: any): Promise<string> {
  let command = `backlog browser`;
  if (args.port) command += ` --port ${args.port}`;
  if (args.noOpen) command += ` --no-open`;

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
