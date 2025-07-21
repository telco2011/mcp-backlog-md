#!/usr/bin/env node

import * as changeCase from "change-case";

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { fileURLToPath } from 'url';
import path from 'path';
import pckJson from '../package.json' with { type: 'json' };
import { readdir } from 'fs/promises';
import { McpTool } from "./lib/types.js";

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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class BacklogServer {
  private server: McpServer;
  private tools: McpTool[] = [];

  constructor() {
    this.server = new McpServer(
      {
        name: pckJson.name,
        version: pckJson.version,
        title: changeCase.capitalCase(pckJson.name)
      }
    );
    console.log('MCP Server:', this.server);

    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  private async registerTools() {
    const toolsDir = path.join(__dirname, 'tools');
    const files = await readdir(toolsDir);
    for (const file of files) {
      if (file.endsWith('.js')) {
        // After compilation, files will be .js
        const toolModule = await import(path.join(toolsDir, file));
        if (toolModule.default) {
          this.tools.push(toolModule.default);
        }
      }
    }
    for (const tool of this.tools) {
      this.server.tool(changeCase.capitalCase(tool.definition.name), tool.definition.description, tool.definition.inputSchema, tool.execute); 
    }
    console.log('MCP Server with tools:', this.server.server.getClientCapabilities());
  }

  async run() {
    await this.registerTools();
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
  }
}

const server = new BacklogServer();
server.run().catch(console.error);
