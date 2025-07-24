# Logging Strategy

This document outlines the logging strategy for the MCP Backlog.md Server.

## Tooling

- **Logger**: [Pino](https://getpino.io/) - A high-performance, low-overhead logger.
- **Prettifier**: [pino-pretty](https://github.com/pinojs/pino-pretty) - For development-friendly, colorized output.

## Log Format

All log messages are structured to provide maximum context with a clear, readable format. The format is:

```
[<time>] <level> [<context>]: <message>. [META]: <json>
```

- **`<time>`**: ISO 8601 timestamp.
- **`<level>`**: The log level (e.g., INFO, WARN, ERROR).
- **`<context>`**: The origin of the log message (e.g., the class, module, or tool name).
- **`<message>`**: The main log message.
- **`[META]`**: An optional JSON payload containing additional structured data.

## Contextual Logging

To ensure traceability, we use child loggers. Each major component of the application creates a child logger with a specific `context` property.

- **Server Entrypoint (`src/server.ts`)**: `context: 'Server'`
- **MCP Server Class (`src/lib/backlogMCPServer.ts`)**: `context: 'BacklogMCPServer'`
- **Command Executor (`src/lib/commandExecutor.ts`)**: `context: 'CommandExecutor'`
- **Tools (`src/tools/*.ts`)**: `context: 'ToolName'` (e.g., `CreateTask`, `EditTask`)

This ensures that every log message is clearly attributable to its source, which is invaluable for debugging and monitoring.

## Environments

The logging output is dependent on the `NODE_ENV` environment variable.

- **Development (`NODE_ENV=development`)**: When `NODE_ENV` is set to `development`, the logger uses `pino-pretty` to produce colorized, human-readable output. This is the recommended setting for local development.

- **Production (Default)**: If `NODE_ENV` is not set or has any value other than `development`, the logger will output structured, newline-delimited JSON (NDJSON). This format is optimized for log collection, parsing, and analysis by external services (e.g., Datadog, Splunk, or the ELK stack).

## Implementation

The core logger is configured in `src/lib/logger.ts`. This module exports a base `pino` instance that is then used to create child loggers throughout the application.
