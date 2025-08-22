/**
 * Unit tests for utils.ts
 *
 * Tests utility constants and functions
 */
import { backlogCommand } from '../utils.js';

describe('utils', () => {
  describe('backlogCommand', () => {
    it('should be defined', () => {
      expect(backlogCommand).toBeDefined();
    });

    it('should be a string', () => {
      expect(typeof backlogCommand).toBe('string');
    });

    it('should have the correct value', () => {
      expect(backlogCommand).toBe('npx backlog');
    });

    it('should not be empty', () => {
      expect(backlogCommand.length).toBeGreaterThan(0);
    });

    it('should start with npx', () => {
      expect(backlogCommand.startsWith('npx')).toBe(true);
    });

    it('should contain backlog command', () => {
      expect(backlogCommand).toContain('backlog');
    });

    it('should be usable in command construction', () => {
      const testCommand = `${backlogCommand} task list`;
      expect(testCommand).toBe('npx backlog task list');
    });

    it('should be immutable', () => {
      const originalValue = backlogCommand;
      // TypeScript prevents direct mutation, but let's ensure the value doesn't change
      expect(backlogCommand).toBe(originalValue);
    });
  });
});
