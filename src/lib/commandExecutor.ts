/**
 * commandExecutor.ts
 *
 * Purpose:
 * - Provides a single, centralized function for executing shell commands.
 * - Standardizes error handling, logging, and response formatting for all tool commands.
 * - Manages the repository path from one location.
 *
 * Logic Overview:
 * 1. Exports an `executeCommand` function that takes an options object including command, success message, and repository path.
 * 2. The function wraps the `child_process.exec` call in a promise and a try/catch block.
 * 3. It handles stdout, stderr, and execution errors, returning a consistent object structure.
 *
 * Last Updated:
 * 2025-07-25 by Cline (Model: claude-3-opus, Task: Made repository path configurable and passed as parameter)
 */
import { exec } from 'child_process';
import { promisify } from 'util';

import { CallToolResult } from '@modelcontextprotocol/sdk/types.js';

const execAsync = promisify(exec);

/**
 * Executes a shell command and returns a standardized response object.
 * @param options An object containing the command, success message, and repository path.
 * @returns A string containing the result of the command execution.
 */
export async function executeCommand(options: { command: string; successMessage: string; projectPath: string }): Promise<CallToolResult> {
  console.info({ command: options.command }, 'Executing command');
  try {
    const { stdout, stderr } = await execAsync(options.command, { cwd: options.projectPath });

    if (stderr) {
      console.error({ stderr }, 'Command execution resulted in stderr');
      throw new Error(`Command execution error: ${stderr}`);
    }

    console.info({ stdout }, 'Command executed successfully');
    return {
      content: [{ type: 'text', text: `${stdout.trim()}`, _meta: { successMessage: options.successMessage } }],
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error({ err: error }, 'Failed to execute command');
    // Re-throw the error to be caught by the server's central error handler
    throw new Error(`Server execution failed: ${message}. Command executed: ${options.command}`);
  }
}
