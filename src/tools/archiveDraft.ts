/**
 * @file archiveDraft.ts
 * @description Defines the MCP tool for archiving drafts in backlog.md.
 * This tool maps directly to the `backlog draft archive` CLI command.
 */
import * as changeCase from 'change-case';
import { z } from 'zod';

import { CallToolResult } from '@modelcontextprotocol/sdk/types.js';

import { executeCommand } from '../lib/commandExecutor.js';
import { withProjectPath } from '../lib/schemas.js';
import { backlogCommand } from '../lib/utils.js';

const name = 'archiveDraft';

const schema = {
  id: z.string().describe('The ID of the draft to archive'),
  ids: z.string().optional().describe('A comma-separated string of draft IDs to archive'),
  ...withProjectPath.shape,
};

export const _zSchema = z.object(schema);

async function execute(params: z.infer<typeof _zSchema>): Promise<CallToolResult> {
  console.info('Archiving draft(s)', params);
  
  let command = `${backlogCommand} draft archive`;
  if (params.ids) {
    // Handle multiple draft IDs
    const ids = params.ids.split(',').map(id => id.trim());
    command += ` ${ids.join(' ')}`;
  } else {
    // Handle single draft ID
    command += ` ${params.id}`;
  }

  return executeCommand({
    command,
    successMessage: 'Draft(s) archived successfully',
    projectPath: params.projectPath,
  });
}

export default {
  definition: {
    name,
    title: changeCase.capitalCase(name),
    description: 'Archive a draft or drafts in backlog.md',
    inputSchema: schema,
  },
  execute,
};