import * as changeCase from 'change-case';

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { fileURLToPath } from 'url';
import path from 'path';
import pckJson from '../../package.json' with { type: 'json' };
import { readdir } from 'fs/promises';
import { McpTool } from './types.js';
import logger from './logger.js';

export class BacklogMCPServer {
  private server: McpServer;
  private logger = logger.child({ context: 'BacklogMCPServer' });
  private __filename: string;
  private __dirname: string;

  constructor() {
    this.__filename = fileURLToPath(import.meta.url);
    this.__dirname = path.dirname(this.__filename);
    
    this.logger.info('Initializing Backlog MCP Server...');
    this.server = new McpServer({
      name: pckJson.name,
      version: pckJson.version,
      title: changeCase.capitalCase(pckJson.name),
    });

    process.on('SIGINT', async () => {
      this.logger.info('Shutting down server...');
      await this.server.close();
      process.exit(0);
    });
  }

  private async registerTools() {
    const toolsDir = path.join(this.__dirname, '../tools');
    this.logger.info(`Scanning for tools in ${toolsDir}`);

    try {
      const files = await readdir(toolsDir);
      this.logger.info(`Found ${files.length} potential tool files.`);

      for (const file of files) {
        if (file.endsWith('.js')) {
          const toolFilePath = path.join(toolsDir, file);
          const toolModule = await import(toolFilePath);

          if (toolModule.default) {
            const tool: McpTool = toolModule.default;
            const toolName = changeCase.capitalCase(tool.definition.name);
            this.logger.info(`Registering tool: ${toolName}`);
            this.server.tool(
              toolName,
              tool.definition.description,
              tool.definition.inputSchema,
              tool.execute
            );
          } else {
            this.logger.warn(`No default export found in ${toolFilePath}`);
          }
        }
      }
    } catch (error) {
      this.logger.error({ err: error }, 'Failed to register tools');
      throw error;
    }
  }

  async run() {
    await this.registerTools();
    const transport = new StdioServerTransport();
    this.logger.info('Connecting to transport...');
    await this.server.connect(transport);
    this.logger.info('Server is running and connected.');
  }
}
