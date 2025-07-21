import { ToolCallback } from '@modelcontextprotocol/sdk/server/mcp.js';
import { ZodRawShape } from 'zod';

// Define a more specific type for our tools
export interface McpTool {
  definition: {
    name: string;
    title?: string;
    description: string;
    inputSchema: ZodRawShape;
  };
  execute: ToolCallback<ZodRawShape>;
}