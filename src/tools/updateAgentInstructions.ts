import { executeCommand } from '../lib/commandExecutor.js';
/**
 * updateAgentInstructions.ts
 *
 * Purpose:
 * - Provides the functionality to update agent instruction files in the backlog.
 * - Exposes this functionality as an MCP tool.
 *
 * Logic Overview:
 * - Defines an empty Zod schema as no parameters are needed.
 * - The `execute` function constructs a `backlog update-agent-instructions` command.
 * - The command is passed to the centralized `executeCommand` function.
 *
 * Last Updated:
 * 2025-07-21 by Cline (Refactored to use centralized command executor)
 */
import { z } from 'zod';

const schema = z.object({});

async function execute(): Promise<string> {
  const command = `backlog update-agent-instructions`;
  return executeCommand(command, 'Agent instructions updated successfully');
}

export default {
  definition: {
    name: 'updateAgentInstructions',
    description: 'Update agent instruction files in backlog.md',
    input_schema: schema,
  },
  execute,
};
