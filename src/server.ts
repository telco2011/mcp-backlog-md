#!/usr/bin/env node

import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { exec } from 'child_process';
import { fileURLToPath } from 'url';
import path from 'path';
import { readdir } from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class BacklogServer {
  private server: Server;
  private tools: any[] = [];

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
      if (file.endsWith('.js')) { // After compilation, files will be .js
        const toolModule = await import(path.join(toolsDir, file));
        if (toolModule.default) {
          this.tools.push(toolModule.default);
        }
      }
    }
  }

  private setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: this.tools.map(t => t.definition),
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const tool = this.tools.find(t => t.definition.name === request.params.name);
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
      } catch (error: any) {
        return {
          content: [
            {
              type: 'text',
              text: error.message,
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
