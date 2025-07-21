#!/usr/bin/env node

import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from '@modelcontextprotocol/sdk/types';

import { Server } from '@modelcontextprotocol/sdk/server/index';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio';
import { ZodSchema } from 'zod';
import { fileURLToPath } from 'url';
import path from 'path';
import { readdir } from 'fs/promises';

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

// Define a more specific type for our tools
interface McpTool {
  definition: {
    name: string;
    description: string;
    input_schema: ZodSchema;
  };
  execute: (args: unknown) => Promise<string>;
}

export class BacklogServer {
  private server: Server;
  private tools: McpTool[] = [];

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
    // The `ListTools` handler now correctly returns the full tool definitions.
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

      // Validate the arguments against the tool's specific Zod schema.
      const validationResult = tool.definition.input_schema.safeParse(
        request.params.arguments
      );

      if (!validationResult.success) {
        throw new McpError(
          ErrorCode.InvalidParams,
          `Invalid parameters for tool ${
            request.params.name
          }: ${validationResult.error.toString()}`
        );
      }

      // The tool's `execute` function now handles its own logic and erroring.
      // The central error handler on the server will catch any thrown errors.
      const resultText = await tool.execute(validationResult.data);

      // Format the successful result into the standard MCP response.
      return {
        content: [
          {
            type: 'text',
            text: resultText,
          },
        ],
      };
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
