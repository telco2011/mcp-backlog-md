import { exec } from 'child_process';
import { promisify } from 'util';
/**
 * createDecision.ts
 *
 * Purpose:
 * - Provides the functionality to create a new decision in the backlog.
 * - Exposes this functionality as an MCP tool.
 *
 * Logic Overview:
 * 1. Defines a Zod schema (`createDecisionSchema`) to validate the parameters for creating a decision.
 * 2. The `createDecisionHandler` function takes the validated parameters.
 * 3. It constructs a `backlog decision create` CLI command based on the provided parameters.
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
 * Defines the schema for the parameters required to create a decision.
 * This schema is used by Zod to validate the input at runtime, ensuring type safety.
 */
export const createDecisionSchema = z.object({
  title: z.string().describe('The title of the decision.'),
  status: z.string().optional().describe('The status of the decision.'),
});

/**
 * Handles the logic for creating a decision.
 * It constructs and executes the `backlog decision create` command.
 *
 * @param params The input parameters, validated against the `createDecisionSchema`.
 * @returns An object containing the result of the command execution.
 */
export async function createDecisionHandler(
  params: z.infer<typeof createDecisionSchema>
) {
  // Start building the command.
  let command = `backlog decision create "${params.title}"`;

  // Append optional parameters to the command if they are provided.
  if (params.status) command += ` --status "${params.status}"`;

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
          text: `Decision created successfully: ${stdout.trim()}`,
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
  createDecisionSchema,
  createDecisionHandler,
};
