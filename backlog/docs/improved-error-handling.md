# Improved Error Handling Strategy

## Purpose
To provide more structured and informative error messages from the MCP server to the client by distinguishing between different types of execution errors.

## High-Level Flow
1.  When a command is executed via `commandExecutor.ts`, any errors are caught.
2.  The error is inspected to determine its source.
3.  The original error is wrapped in a custom error class (`CliError` or `SystemError`) that provides more context.
4.  This custom error is thrown and caught by the MCP server's default error handler.
5.  The server sends the descriptive error message to the client.

## Custom Error Classes
-   **`McpError`**: A base error class for all application-specific errors.
-   **`CliError`**: Represents an error originating from the `backlog.md` CLI tool itself (e.g., invalid command, task not found). This is typically identified when the child process writes to `stderr`.
-   **`SystemError`**: Represents a system-level error that prevents the CLI tool from running (e.g., `backlog` command not found in PATH, file system issues).

## Implementation
-   **`src/lib/errors.ts`**: Defines the custom error classes.
-   **`src/lib/commandExecutor.ts`**: The `executeCommand` function contains the logic to catch, wrap, and re-throw errors using the appropriate custom class.
