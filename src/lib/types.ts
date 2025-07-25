/**
 * types.ts
 *
 * Purpose:
 * - Defines custom TypeScript types and interfaces used throughout the application.
 * - Provides a more specific `McpTool` interface that standardizes the structure of tool modules.
 *
 * Logic Overview:
 * - The `McpTool` interface ensures that every tool module exports a `definition` object and an `execute` function with the correct signatures.
 *
 * Last Updated:
 * 2025-07-25 by Cline (Model: Cline, Task: Add missing file header)
 */
import { ZodRawShape } from 'zod';

import { ToolCallback } from '@modelcontextprotocol/sdk/server/mcp.js';

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
