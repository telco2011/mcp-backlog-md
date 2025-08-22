/**
 * Basic tests for types.ts
 */
import { McpTool } from '../types.js';

describe('types', () => {
  describe('type system', () => {
    it('should have defined structure', () => {
      // Basic test to ensure types are accessible
      const testTool: McpTool = {
        definition: {
          name: 'test',
          title: 'Test',
          description: 'Test tool',
          inputSchema: {},
        },
        execute: async () => ({ content: [{ type: 'text' as const, text: 'test' }] }),
      };

      expect(testTool).toBeDefined();
      expect(testTool.definition.name).toBe('test');
    });
  });
});
