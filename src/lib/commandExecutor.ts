import { CliError, SystemError } from './errors.js';

import { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
/**
 * commandExecutor.ts
 *
 * Design Doc: backlog/docs/improved-error-handling.md
 *
 * Purpose:
 * - Provides a single, centralized function for executing shell commands.
 * - Standardizes error handling, logging, and response formatting for all tool commands.
 * - Manages the repository path from one location.
 *
 * Logic Overview:
 * 1. Exports an `executeCommand` function that takes a strongly-typed options object.
 * 2. It validates the project path's existence before execution.
 * 3. It wraps the `child_process.exec` call in a promise.
 * 4. It catches errors and wraps them in custom error classes (`CliError`, `SystemError`) to provide more context.
 * 5. It includes robust error logging, preserving the original error context.
 *
 * SECURITY WARNING:
 * This function uses `exec`, which can be vulnerable to command injection if parts of the command
 * string come from unsanitized user input. Prefer `execFile` when possible, which separates
 * the command from its arguments, mitigating this risk.
 *
 * Last Updated:
 * 2025-07-25 by Cline (Model: claude-3-opus, Task: Improve Error Handling)
 */
import { exec } from 'child_process';
import { existsSync } from 'fs';
import { join } from 'path';
// CHANGE: Import 'join' for robust path handling
import { promisify } from 'util';

const execAsync = promisify(exec);

// CHANGE: Defined a dedicated interface for options for better type safety and clarity.
interface ExecuteCommandOptions {
  command: string;
  successMessage: string;
  projectPath: string;
}

/**
 * Validates that the necessary project structure exists.
 * @param projectPath The root path of the project.
 */
function _validateProjectPath(projectPath: string): void {
  // CHANGE: Simplified and more robust path validation logic.
  if (!projectPath) {
    throw new Error('Project path was not provided.');
  }

  const configPath = join(projectPath, 'backlog', 'config.yml');

  if (!existsSync(configPath)) {
    console.error({ configPath }, 'Backlog.md configuration does not exist.');
    throw new SystemError(
      `Backlog.md has not been initialized. Expected config at: ${configPath}.
      Check https://github.com/MrLesk/Backlog.md?tab=readme-ov-file#project-setup for more information or execute "npx backlog init" to create the backlog.md project.`,
    );
  }
}

/**
 * Executes a shell command and returns a standardized response object.
 * @param options An object containing the command, success message, and project path.
 * @returns A string containing the result of the command execution.
 */
export async function executeCommand(options: ExecuteCommandOptions): Promise<CallToolResult> {
  console.info({ command: options.command }, 'Executing command');

  try {
    _validateProjectPath(options.projectPath);

    const { stdout, stderr } = await execAsync(options.command, { cwd: options.projectPath });

    if (stderr) {
      console.warn({ stderr }, 'Command executed with output to stderr (this may be informational)');
    }

    console.info({ stdout }, 'Command executed successfully');
    return {
      content: [{ type: 'text', text: stdout.trim(), _meta: { successMessage: options.successMessage } }],
    };
  } catch (error: unknown) {
    const originalError = error as { stdout: string; stderr: string; message: string };
    const errorMessage = originalError.stderr || originalError.message;

    console.error({ err: originalError }, 'Failed to execute command');

    // If the error contains stderr, it's likely a CLI tool error.
    if (originalError.stderr) {
      throw new CliError(`Command failed with error: ${errorMessage}. Command: "${options.command}"`, {
        cause: error,
      });
    }

    // Otherwise, it's likely a system-level error (e.g., command not found).
    throw new SystemError(`Server execution failed: ${errorMessage}. Command: "${options.command}"`, {
      cause: error,
    });
  }
}
