/**
 * errors.ts
 *
 * Design Doc: backlog/docs/improved-error-handling.md
 *
 * Purpose:
 * - Defines custom error classes for the MCP server.
 *
 * Logic Overview:
 * - McpError: A base class for all custom errors.
 * - CliError: Represents an error originating from the backlog.md CLI tool.
 * - SystemError: Represents a system-level error (e.g., command not found).
 *
 * Last Updated:
 * 2025-07-25 by Cline (Model: claude-3-opus, Task: Improve Error Handling)
 */

export class McpError extends Error {
  constructor(message: string, options?: { cause: unknown }) {
    super(message, options);
    this.name = this.constructor.name;
  }
}

export class CliError extends McpError {
  constructor(message: string, options?: { cause: unknown }) {
    super(message, options);
  }
}

export class SystemError extends McpError {
  constructor(message: string, options?: { cause: unknown }) {
    super(message, options);
  }
}
