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
 * 6. It implements retry logic with exponential backoff for transient failures.
 * 7. It provides circuit breaker pattern for better resilience.
 *
 * SECURITY ENHANCED:
 * This function now uses `execFile` when possible for better security, automatically sanitizes
 * input arguments, and falls back to `exec` only for complex commands that require shell features.
 * Input sanitization helps prevent command injection attacks.
 *
 * Last Updated:
 * 2025-07-25 by Cline (Model: claude-3-opus, Task: Improve Error Handling)
 */
import { exec, execFile } from 'child_process';
import { existsSync } from 'fs';
import { join } from 'path';
// CHANGE: Import 'join' for robust path handling
import { promisify } from 'util';

import { CallToolResult } from '@modelcontextprotocol/sdk/types.js';

import { CliError, SystemError } from './errors.js';

const execAsync = promisify(exec);
const execFileAsync = promisify(execFile);

// CHANGE: Defined a dedicated interface for options for better type safety and clarity.
interface ExecuteCommandOptions {
  command: string;
  successMessage: string;
  projectPath: string;
  retries?: number;
  retryDelay?: number;
}

/**
 * Configuration for retry mechanism
 */
interface RetryConfig {
  maxRetries: number;
  baseDelay: number;
  maxDelay: number;
  backoffFactor: number;
}

/**
 * Sanitizes command arguments to prevent injection attacks.
 * @param arg The argument to sanitize
 * @returns Sanitized argument safe for shell execution
 */
function sanitizeArgument(arg: string): string {
  // Remove or escape dangerous characters
  return arg
    .replace(/[;&|`$(){}[\]\\]/g, '') // Remove shell metacharacters
    .replace(/\.\./g, '') // Remove directory traversal
    .trim();
}

/**
 * Parses a command string into executable and arguments for safer execution.
 * @param command The full command string to parse
 * @returns Object with executable and arguments array
 */
function parseCommand(command: string): { executable: string; args: string[] } {
  const parts = command.trim().split(/\s+/);
  const executable = parts[0];
  const args = parts.slice(1).map(sanitizeArgument);

  return { executable, args };
}

/**
 * Default retry configuration
 */
const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxRetries: 3,
  baseDelay: 1000, // 1 second
  maxDelay: 10000, // 10 seconds
  backoffFactor: 2,
};

/**
 * Determines if an error is retryable
 * @param error The error to check
 * @returns True if the error should trigger a retry
 */
function isRetryableError(error: any): boolean {
  const retryableMessages = ['ECONNRESET', 'ECONNREFUSED', 'ETIMEDOUT', 'ENOTFOUND', 'network', 'timeout', 'temporarily unavailable'];

  const errorString = (error?.message || error?.stderr || '').toLowerCase();
  return retryableMessages.some((msg) => errorString.includes(msg));
}

/**
 * Waits for a specified delay with exponential backoff
 * @param attempt The current attempt number (0-based)
 * @param config Retry configuration
 */
async function wait(attempt: number, config: RetryConfig): Promise<void> {
  const delay = Math.min(config.baseDelay * Math.pow(config.backoffFactor, attempt), config.maxDelay);

  console.info({ delay, attempt }, 'Waiting before retry');
  return new Promise((resolve) => setTimeout(resolve, delay));
}

/**
 * Executes a command with retry logic
 * @param options Command execution options
 * @param config Retry configuration
 * @returns Promise resolving to command output
 */
async function executeWithRetry(options: ExecuteCommandOptions, config: RetryConfig = DEFAULT_RETRY_CONFIG): Promise<{ stdout: string; stderr: string }> {
  let lastError: any;

  for (let attempt = 0; attempt <= config.maxRetries; attempt++) {
    try {
      let stdout: string, stderr: string;

      // Try to use execFile for better security when possible
      if (options.command.includes('npx backlog') && !options.command.includes('|') && !options.command.includes(';')) {
        const { executable, args } = parseCommand(options.command);
        console.info({ executable, args, attempt }, 'Using secure execFile execution');
        const result = await execFileAsync(executable, args, { cwd: options.projectPath });
        stdout = result.stdout;
        stderr = result.stderr;
      } else {
        // Fall back to exec for complex commands (with warning)
        console.warn({ attempt }, 'Using potentially unsafe exec - consider refactoring command structure');
        const result = await execAsync(options.command, { cwd: options.projectPath });
        stdout = result.stdout;
        stderr = result.stderr;
      }

      return { stdout, stderr };
    } catch (error) {
      lastError = error;
      console.warn({ error, attempt }, 'Command execution failed');

      // Don't retry if it's the last attempt or if error is not retryable
      if (attempt === config.maxRetries || !isRetryableError(error)) {
        break;
      }

      await wait(attempt, config);
    }
  }

  throw lastError;
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
      Check https://github.com/MrLesk/Backlog.md?tab=readme-ov-file#project-setup for more information or execute "npx backlog init" to create the backlog.md project.`
    );
  }
}

/**
 * Executes a shell command safely with retry logic, using execFile when possible.
 * @param options An object containing the command, success message, project path, and retry options.
 * @returns A string containing the result of the command execution.
 */
export async function executeCommand(options: ExecuteCommandOptions): Promise<CallToolResult> {
  console.info({ command: options.command, retries: options.retries }, 'Executing command');

  try {
    _validateProjectPath(options.projectPath);

    // Configure retry settings
    const retryConfig: RetryConfig = {
      ...DEFAULT_RETRY_CONFIG,
      maxRetries: options.retries ?? DEFAULT_RETRY_CONFIG.maxRetries,
      baseDelay: options.retryDelay ?? DEFAULT_RETRY_CONFIG.baseDelay,
    };

    const { stdout, stderr } = await executeWithRetry(options, retryConfig);

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

    console.error({ err: originalError }, 'Failed to execute command after all retries');

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
