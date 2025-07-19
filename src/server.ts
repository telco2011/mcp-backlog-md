#!/usr/bin/env node

import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';

/**
 * server.ts
 *
 * Purpose:
 * - Initializes and runs the MCP server for backlog.md.
 * - Dynamically loads all tool definitions from the `src/tools` directory.
 * - Handles MCP requests for listing and calling tools.
 *
 * Logic Overview:
 * 1. Initializes the MCP Server instance.
 * 2. Scans the `src/tools` directory to discover all available tool modules.
 * 3. Registers request handlers for `ListTools` and `CallTool`.
 * 4. The `CallTool` handler delegates execution to the appropriate tool module.
 * 5. Connects to the transport layer (Stdio) to communicate with the client.
 *
 * Last Updated:
 * 2025-07-19 by Cline.bot (Initial creation)
 */
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { fileURLToPath } from 'url';
import path from 'path';
import { readdir } from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class BacklogServer {
  private server: Server;
  private tools: {
    definition: { name: string };
    execute: (args: unknown) => Promise<unknown>;
  }[] = [];

  constructor() {
    this.server = new Server(
      {
        name: 'mcp-backlog-md',
        version: '0.1.0',
      },
      {
        capabilities: {
          resources: {},
          tools: {},
        },
      }
    );

    this.server.onerror = (error) => console.error('[MCP Error]', error);
    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  private async loadTools() {
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
  }

  private setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: this.tools.map((t) => t.definition),
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const tool = this.tools.find(
        (t) => t.definition.name === request.params.name
      );
      if (!tool) {
        throw new McpError(
          ErrorCode.MethodNotFound,
          `Unknown tool: ${request.params.name}`
        );
      }

      try {
        const result = await tool.execute(request.params.arguments);
        return {
          content: [
            {
              type: 'text',
              text: result,
            },
          ],
        };
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);
        return {
          content: [
            {
              type: 'text',
              text: message,
            },
          ],
          isError: true,
        };
      }
    });
  }

  async run() {
    await this.loadTools();
    this.setupToolHandlers();
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Backlog.md MCP server running on stdio');
  }
}

const server = new BacklogServer();
server.run().catch(console.error);
