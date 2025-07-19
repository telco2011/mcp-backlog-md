import { exec } from 'child_process';
import { promisify } from 'util';
/**
 * editTask.ts
 *
 * Purpose:
 * - Provides the functionality to edit an existing task in the backlog.
 * - Exposes this functionality as an MCP tool.
 *
 * Logic Overview:
 * 1. Defines a Zod schema (`editTaskSchema`) to validate the parameters for editing a task.
 * 2. The `editTaskHandler` function takes the validated parameters.
 * 3. It constructs a `backlog task edit` CLI command based on the provided parameters.
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
 * Defines the schema for the parameters required to edit a task.
 * This schema is used by Zod to validate the input at runtime, ensuring type safety.
 */
export const editTaskSchema = z.object({
  id: z.string().describe('The ID of the task to edit.'),
  assignee: z
    .string()
    .optional()
    .describe("The new assigned user, e.g., '@dave'."),
  labels: z
    .array(z.string())
    .optional()
    .describe("A new list of labels, e.g., ['bug', 'backend']."),
  plan: z.string().optional().describe('The new plan for the task.'),
  ac: z.string().optional().describe('New acceptance criteria for the task.'),
  notes: z.string().optional().describe('New notes for the task.'),
  dep: z
    .string()
    .optional()
    .describe('A new comma-separated list of dependencies.'),
});

/**
 * Handles the logic for editing a task.
 * It constructs and executes the `backlog task edit` command.
 *
 * @param params The input parameters, validated against the `editTaskSchema`.
 * @returns An object containing the result of the command execution.
 */
export async function editTaskHandler(params: z.infer<typeof editTaskSchema>) {
  // Start building the command with the mandatory task ID.
  let command = `backlog task edit ${params.id}`;

  // Append optional parameters to the command if they are provided.
  if (params.assignee) command += ` -a "${params.assignee}"`;
  if (params.labels) command += ` -l ${params.labels.join(',')}`;
  if (params.plan) command += ` --plan "${params.plan}"`;
  if (params.ac) command += ` --ac "${params.ac}"`;
  if (params.notes) command += ` --notes "${params.notes}"`;
  if (params.dep) command += ` --dep ${params.dep}`;

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
        { type: 'text', text: `Task edited successfully: ${stdout.trim()}` },
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
  editTaskSchema,
  editTaskHandler,
};
