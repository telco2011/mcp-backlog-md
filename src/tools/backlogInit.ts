import * as changeCase from 'change-case';

import { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { executeCommand } from '../lib/commandExecutor.js';
import { z } from 'zod';

const schema = {
  projectName: z.string().describe('Identifier for your backlog'),
};
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const zSchema = z.object(schema);

async function execute(params: z.infer<typeof zSchema>): Promise<CallToolResult> {
  let command = `backlog init`;
  if (params.projectName) command += ` ${params.projectName}`;
  return executeCommand(command, 'Backlog Initialization successfully.');
}

export default {
  definition: {
    name: 'init',
    title: changeCase.capitalCase('init'),
    description: 'Initialize project',
    inputSchema: schema,
  },
  execute,
};
