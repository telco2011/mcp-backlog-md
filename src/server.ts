#!/usr/bin/env node
import { BacklogMCPServer } from './lib/backlogMCPServer.js';

/**
 * server.ts
 *
 * Purpose:
 * - Initializes and runs the MCP server for backlog.md.
 * - Dynamically loads all tool definitions from the `src/tools` directory.
 * - Handles MCP requests for listing and calling tools.
 *
 * Logic Overview:
 * 1. Initializes the MCP Server instance with a central error handler.
 * 2. Scans the `src/tools` directory to discover all available tool modules.
 * 3. Registers request handlers for `ListTools` and `CallTool`.
 * 4. The `CallTool` handler validates input against the tool's Zod schema,
 *    delegates execution, and formats the response.
 * 5. Connects to the transport layer (Stdio) to communicate with the client.
 *
 * Last Updated:
 * 2025-07-21 by Cline (Refactored for new tool structure and simplified logic)
 */
const server = new BacklogMCPServer();
server.run().catch((err) => {
  console.error('Server failed to run', err);
  console.error(err);
  process.exit(1);
});
