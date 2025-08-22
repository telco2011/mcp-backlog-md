/**
 * Unit tests for schemas.ts
 *
 * Tests the shared Zod schemas used across tools
 */
import { z } from 'zod';

import { withProjectPath } from '../schemas.js';

describe('schemas', () => {
  describe('withProjectPath', () => {
    it('should be a valid Zod object', () => {
      expect(withProjectPath).toBeInstanceOf(z.ZodObject);
    });

    it('should have projectPath field', () => {
      expect(withProjectPath.shape.projectPath).toBeDefined();
      expect(withProjectPath.shape.projectPath).toBeInstanceOf(z.ZodString);
    });

    it('should validate valid project path', () => {
      const validData = { projectPath: '/valid/project/path' };
      const result = withProjectPath.safeParse(validData);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.projectPath).toBe('/valid/project/path');
      }
    });

    it('should reject missing projectPath', () => {
      const invalidData = {};
      const result = withProjectPath.safeParse(invalidData);

      expect(result.success).toBe(false);
    });

    it('should reject non-string projectPath', () => {
      const invalidData = { projectPath: 123 };
      const result = withProjectPath.safeParse(invalidData);

      expect(result.success).toBe(false);
    });

    it('should handle empty string projectPath', () => {
      const emptyData = { projectPath: '' };
      const result = withProjectPath.safeParse(emptyData);

      // Empty string is still a valid string
      expect(result.success).toBe(true);
    });

    it('should handle various valid path formats', () => {
      const testPaths = [
        '/absolute/path',
        './relative/path',
        '../parent/path',
        '~/home/path',
        'simple-path',
        '/path/with spaces/project',
        '/path-with-dashes_and_underscores',
      ];

      for (const path of testPaths) {
        const result = withProjectPath.safeParse({ projectPath: path });
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.projectPath).toBe(path);
        }
      }
    });

    it('should be extensible for use in tool schemas', () => {
      // Test that we can extend the schema (like tools do)
      const extendedSchema = z.object({
        ...withProjectPath.shape,
        additionalField: z.string().optional(),
      });

      const result = extendedSchema.safeParse({
        projectPath: '/test/path',
        additionalField: 'test value',
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.projectPath).toBe('/test/path');
        expect(result.data.additionalField).toBe('test value');
      }
    });
  });
});
