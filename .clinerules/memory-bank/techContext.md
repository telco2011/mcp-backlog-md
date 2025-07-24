# Tech Context

## Technologies Used

- **Language:** TypeScript
- **Runtime:** Node.js
- **Framework:** MCP Server
- **Libraries:**
  - zod: for schema validation
  - commander: for command-line interface
  - pino: for logging
  - pino-pretty: for pretty-printing logs

## Development Setup

The project is intended to be published as an npm package. Currently, for development:

1.  Clone the repository.
2.  Run `npm install` to install dependencies.
3.  Run `npm run build` to compile the TypeScript code.

## Technical Constraints

- Requires Node.js to be installed on the system.
- Requires the `backlog.md` CLI tool to be installed and available in the system's PATH.

## Dependencies

- **@modelcontextprotocol/sdk:** For MCP server implementation.
- **zod:** For schema validation of tool inputs.
- **pino**: For structured logging.
- **backlog.md:** External CLI tool that this server wraps.

## Tool Usage Patterns

[Describe any patterns for using specific tools.]

## Environment Variables

- `NODE_ENV`: Controls the logging output format.
  - `development`: Enables `pino-pretty` for colorized, human-readable logs.
  - `production` (or any other value): Enables structured JSON logging for production environments.
