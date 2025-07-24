# System Patterns

## System Architecture

The system is a monolithic MCP server, designed to run as a standalone Node.js process. Its primary architectural pattern is the dynamic loading of tools at runtime.

- **Entry Point (`src/server.ts`):** Initializes the MCP server.
- **Tool Loading:** The server reads the `src/tools` directory to discover all available commands.
- **Tool Interface:** Each file in `src/tools` exports a standardized `McpTool` object containing:
  - `definition`: An object with `name`, `description`, and an `input_schema` (a Zod schema).
  - `execute`: An async function that takes the validated arguments and performs the action, typically by calling the `backlog.md` CLI.
- **Request Handling:** The server has a generic `CallTool` handler that:
  1. Finds the requested tool.
  2. Validates the incoming arguments against the tool's Zod schema.
  3. Calls the tool's `execute` method.
  4. Returns the result or a structured error.

This architecture makes the system highly extensible, as adding a new command only requires adding a new file to the `src/tools` directory, with no changes needed to the core server logic.

## Key Technical Decisions

- **Zod for Validation:** Zod is used for schema definition and input validation for all tools. This ensures that the `execute` function for each tool receives a correctly typed and validated parameters object, preventing a large class of runtime errors.
- **change-case for Naming:** The `change-case` library is used to automatically generate user-friendly tool titles from their camelCase names, ensuring consistency in the MCP server's tool manifest.

## Design Patterns

[List any design patterns that are used in the system, e.g., Repository, Service, etc.]

## Component Relationships

[Describe how the major components of the system interact with each other.]

## Critical Implementation Paths

[Describe any critical paths through the system, e.g., the flow of a request from the API to the database.]
