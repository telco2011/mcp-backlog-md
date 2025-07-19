import { exec } from 'child_process';
import { promisify } from 'util';
/**
 * browser.ts
 *
 * Purpose:
 * - Provides the functionality to launch the web UI for the backlog.
 * - Exposes this functionality as an MCP tool.
 *
 * Logic Overview:
 * 1. Defines a Zod schema (`browserSchema`) to validate the parameters for launching the browser.
 * 2. The `browserHandler` function takes the validated parameters.
 * 3. It constructs a `backlog browser` CLI command based on the provided parameters.
 * 4. The command is executed asynchronously in the specified repository path.
 * 5. The handler returns the result of the command execution, including stdout or any errors.
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
 * Defines the schema for the parameters required to launch the browser.
 * This schema is used by Zod to validate the input at runtime, ensuring type safety.
 */
export const browserSchema = z.object({
  port: z.number().optional().describe('The port to launch the web UI on.'),
  noOpen: z
    .boolean()
    .optional()
    .describe("Don't open the browser automatically."),
});

/**
 * Handles the logic for launching the browser.
 * It constructs and executes the `backlog browser` command.
 *
 * @param params The input parameters, validated against the `browserSchema`.
 * @returns An object containing the result of the command execution.
 */
export async function browserHandler(params: z.infer<typeof browserSchema>) {
  // Start building the command.
  let command = `backlog browser`;

  // Append optional parameters to the command if they are provided.
  if (params.port) command += ` --port ${params.port}`;
  if (params.noOpen) command += ` --no-open`;

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
          text: `Browser launched successfully: ${stdout.trim()}`,
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
  browserSchema,
  browserHandler,
};
