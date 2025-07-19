import { exec } from 'child_process';
import { promisify } from 'util';
/**
 * viewDoc.ts
 *
 * Purpose:
 * - Provides the functionality to view a document in the backlog.
 * - Exposes this functionality as an MCP tool.
 *
 * Logic Overview:
 * 1. Defines a Zod schema (`viewDocSchema`) to validate the parameters for viewing a document.
 * 2. The `viewDocHandler` function takes the validated parameters.
 * 3. It constructs a `backlog doc view` CLI command based on the provided parameters.
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
 * Defines the schema for the parameters required to view a document.
 * This schema is used by Zod to validate the input at runtime, ensuring type safety.
 */
export const viewDocSchema = z.object({
  id: z.string().describe('The ID of the document to view.'),
});

/**
 * Handles the logic for viewing a document.
 * It constructs and executes the `backlog doc view` command.
 *
 * @param params The input parameters, validated against the `viewDocSchema`.
 * @returns An object containing the result of the command execution.
 */
export async function viewDocHandler(params: z.infer<typeof viewDocSchema>) {
  // Start building the command.
  const command = `backlog doc view ${params.id}`;

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
          text: `Document viewed successfully: ${stdout.trim()}`,
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
  viewDocSchema,
  viewDocHandler,
};
