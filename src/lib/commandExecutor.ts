/**
 * commandExecutor.ts
 *
 * Purpose:
 * - Provides a single, centralized function for executing shell commands.
 * - Standardizes error handling, logging, and response formatting for all tool commands.
 * - Manages the repository path from one location.
 *
 * Logic Overview:
 * 1. Defines the REPO_PATH for command execution.
 * 2. Exports an `executeCommand` function that takes a command string and optional success message.
 * 3. The function wraps the `child_process.exec` call in a promise and a try/catch block.
 * 4. It handles stdout, stderr, and execution errors, returning a consistent object structure.
 *
 * Last Updated:
 * 2025-07-21 by Cline (Model: claude-3-opus, Task: Centralized command execution)
 */
import { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// Centralized repository path.
const REPO_PATH = '/home/kratos/Development/Github/The-Dave-Stack/mcp-backlog-md';

/**
 * Executes a shell command and returns a standardized response object.
 * @param command The shell command to execute.
 * @param successMessage The base message to return on success.
 * @returns A string containing the result of the command execution.
 */
export async function executeCommand(command: string, successMessage: string): Promise<CallToolResult> {
  console.log(`🔩 Executing: ${command}`);
  try {
    const { stdout, stderr } = await execAsync(command, { cwd: REPO_PATH });

    if (stderr) {
      console.error(`Command stderr: ${stderr}`);
      throw new Error(`Command execution error: ${stderr}`);
    }

    console.log(`✅ Success: ${stdout}`);
    return {
      content: [{ type: 'text', text: `${stdout.trim()}`, _meta: { successMessage } }],
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('❌ Failed to execute command:', error);
    // Re-throw the error to be caught by the server's central error handler
    throw new Error(`Server execution failed: ${message}`);
  }
}
