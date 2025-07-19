import { exec } from 'child_process';
import { promisify } from 'util';
/**
 * configList.ts
 *
 * Purpose:
 * - Provides the functionality to list the configuration in the backlog.
 * - Exposes this functionality as an MCP tool.
 *
 * Logic Overview:
 * 1. The `configListHandler` function takes no parameters.
 * 2. It constructs a `backlog config list` CLI command.
 * 3. The command is executed asynchronously in the specified repository path.
 * 4. The handler returns the result of the command execution, including stdout or any errors.
 *
 * Last Updated:
 * 2025-07-19 by AI Assistant (Refactored to use Zod for validation and added detailed documentation)
 */
import { z } from 'zod';

const execAsync = promisify(exec);

// The repository path is a critical configuration.
// It's hardcoded for now but should ideally come from a secure config or environment variable.
const REPO_PATH =
  '/home/kratos/Development/Github/The-Dave-Stack/mcp-backlog-md';

/**
 * Defines the schema for the parameters required to list the configuration.
 * This schema is used by Zod to validate the input at runtime, ensuring type safety.
 */
export const configListSchema = z.object({});

/**
 * Handles the logic for listing the configuration.
 * It constructs and executes the `backlog config list` command.
 *
 * @param params The input parameters, validated against the `configListSchema`.
 * @returns An object containing the result of the command execution.
 */
export async function configListHandler() {
  // Start building the command.
  const command = `backlog config list`;

  console.log(`🔩 Executing: ${command}`);

  try {
    // Execute the command in the specified repository directory.
    const { stdout, stderr } = await execAsync(command, { cwd: REPO_PATH });

    // If there's anything in stderr, it's considered an error.
    if (stderr) {
      console.error(`Command stderr: ${stderr}`);
      return {
        content: [{ type: 'text', text: `Command execution error: ${stderr}` }],
      };
    }

    // On success, return the trimmed output from stdout.
    console.log(`✅ Success: ${stdout}`);
    return {
      content: [
        {
          type: 'text',
          text: `Configuration listed successfully: ${stdout.trim()}`,
        },
      ],
    };
  } catch (error: unknown) {
    // Catch any exceptions during command execution.
    const message = error instanceof Error ? error.message : String(error);
    console.error('❌ Failed to execute command:', error);
    return {
      content: [{ type: 'text', text: `Server execution failed: ${message}` }],
    };
  }
}

export default {
  configListSchema,
  configListHandler,
};
