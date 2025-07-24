# MCP Server for Backlog.md

This project provides an MCP (Model Context Protocol) server for the `backlog.md` CLI tool. It allows language models to interact with `backlog.md` to manage tasks, boards, and other project artifacts.

## Getting Started

### Prerequisites

- Node.js
- `backlog.md` CLI tool installed globally (`npm i -g backlog.md`)

### Installation

1. Clone the repository.
2. Install dependencies: `npm install`
3. Build the server: `npm run build`

## Usage

### Testing

To run the tests, use the following command:

```bash
npm test
```

Once the server is running and configured in your MCP client, you can use the exposed tools to interact with `backlog.md`.

## Logging

This server uses `pino` for structured, contextual logging. When running the server, you will see detailed logs in a human-readable format, like this:

```
[2025-07-24T09:53:34.000Z] INFO [Server]: Starting Backlog MCP Server...
[2025-07-24T09:53:34.000Z] INFO [BacklogMCPServer]: Initializing Backlog MCP Server...
[2025-07-24T09:53:34.000Z] INFO [BacklogMCPServer]: Scanning for tools in /path/to/your/project/src/tools
...
```

Each log entry is tagged with its context (e.g., `Server`, `BacklogMCPServer`, `CreateTask`), making it easy to trace the application's execution flow.
