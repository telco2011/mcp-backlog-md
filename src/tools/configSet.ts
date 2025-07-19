import { exec } from 'child_process';
import { promisify } from 'util';
/**
 * configSet.ts
 *
 * Purpose:
 * - Provides the functionality to set a configuration value in the backlog.
 * - Exposes this functionality as an MCP tool.
 *
 * Logic Overview:
 * 1. Defines a Zod schema (`configSetSchema`) to validate the parameters for setting a configuration value.
 * 2. The `configSetHandler` function takes the validated parameters.
 * 3. It constructs a `backlog config set` CLI command based on the provided parameters.
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
 * Defines the schema for the parameters required to set a configuration value.
 * This schema is used by Zod to validate the input at runtime, ensuring type safety.
 */
export const configSetSchema = z.object({
  key: z.string().describe('The configuration key to set.'),
  value: z.string().describe('The value to set for the configuration key.'),
});

/**
 * Handles the logic for setting a configuration value.
 * It constructs and executes the `backlog config set` command.
 *
 * @param params The input parameters, validated against the `configSetSchema`.
 * @returns An object containing the result of the command execution.
 */
export async function configSetHandler(
  params: z.infer<typeof configSetSchema>
) {
  // Start building the command.
  const command = `backlog config set ${params.key} ${params.value}`;

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
          text: `Configuration set successfully: ${stdout.trim()}`,
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
  configSetSchema,
  configSetHandler,
};
