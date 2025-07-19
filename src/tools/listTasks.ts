import { exec } from 'child_process';

const definition = {
  name: 'listTasks',
  description: 'List tasks in backlog.md',
  inputSchema: {
    type: 'object',
    properties: {
      status: {
        type: 'string',
        description: 'Filter by status',
      },
      assignee: {
        type: 'string',
        description: 'Filter by assignee',
      },
      parent: {
        type: 'string',
        description: 'Filter by parent task ID',
      },
    },
  },
};

async function execute(args: any): Promise<string> {
  let command = `backlog task list`;
  if (args.status) command += ` -s "${args.status}"`;
  if (args.assignee) command += ` -a ${args.assignee}`;
  if (args.parent) command += ` -p ${args.parent}`;

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
