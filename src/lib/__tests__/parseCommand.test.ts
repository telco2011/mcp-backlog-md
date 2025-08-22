/**
 * Comprehensive tests for parseCommand function
 * Tests the quote-aware parsing functionality to ensure proper handling
 * of multi-word titles and descriptions in MCP tool commands
 */
import { parseCommand } from '../commandExecutor.js';

describe('parseCommand', () => {
  describe('basic functionality', () => {
    it('should parse simple command without quotes', () => {
      const result = parseCommand('npx backlog task list');
      expect(result).toEqual({
        executable: 'npx',
        args: ['backlog', 'task', 'list'],
      });
    });

    it('should handle empty command', () => {
      expect(() => parseCommand('')).toThrow('Empty command provided');
      expect(() => parseCommand('   ')).toThrow('Empty command provided');
    });

    it('should trim whitespace', () => {
      const result = parseCommand('  npx   backlog   task   list  ');
      expect(result).toEqual({
        executable: 'npx',
        args: ['backlog', 'task', 'list'],
      });
    });
  });

  describe('double quote handling', () => {
    it('should parse command with double-quoted title', () => {
      const result = parseCommand('npx backlog task create "My Task Title"');
      expect(result).toEqual({
        executable: 'npx',
        args: ['backlog', 'task', 'create', 'My Task Title'],
      });
    });

    it('should parse command with multiple quoted arguments', () => {
      const result = parseCommand('npx backlog task create "Multi Word Title" --description "Long description here"');
      expect(result).toEqual({
        executable: 'npx',
        args: ['backlog', 'task', 'create', 'Multi Word Title', '--description', 'Long description here'],
      });
    });

    it('should handle quoted arguments with special characters', () => {
      const result = parseCommand('npx backlog task create "Task: Fix Bug #123 (urgent)"');
      expect(result).toEqual({
        executable: 'npx',
        args: ['backlog', 'task', 'create', 'Task: Fix Bug #123 (urgent)'],
      });
    });

    it('should handle empty quoted strings', () => {
      const result = parseCommand('npx backlog task create ""');
      expect(result).toEqual({
        executable: 'npx',
        args: ['backlog', 'task', 'create', ''],
      });
    });
  });

  describe('single quote handling', () => {
    it('should parse command with single-quoted title', () => {
      const result = parseCommand("npx backlog task create 'My Task Title'");
      expect(result).toEqual({
        executable: 'npx',
        args: ['backlog', 'task', 'create', 'My Task Title'],
      });
    });

    it('should parse command with mixed quote types', () => {
      const result = parseCommand('npx backlog task create "Title with double quotes" --description \'Description with single quotes\'');
      expect(result).toEqual({
        executable: 'npx',
        args: ['backlog', 'task', 'create', 'Title with double quotes', '--description', 'Description with single quotes'],
      });
    });

    it('should handle quotes within different quote types', () => {
      // Note: Escaped quotes within quotes are complex - this tests the current behavior
      const result = parseCommand('npx backlog task create "Title with \\"escaped\\" quotes" --notes \'Notes with "double" quotes\'');
      expect(result).toEqual({
        executable: 'npx',
        args: ['backlog', 'task', 'create', 'Title with \\escaped\\ quotes', '--notes', 'Notes with "double" quotes'],
      });
    });
  });

  describe('real-world MCP command scenarios', () => {
    it('should handle createTask command with multi-word title', () => {
      const result = parseCommand('npx backlog task create "Add OAuth System" --description "Implement OAuth authentication system"');
      expect(result).toEqual({
        executable: 'npx',
        args: ['backlog', 'task', 'create', 'Add OAuth System', '--description', 'Implement OAuth authentication system'],
      });
    });

    it('should handle editTask command with multiple options', () => {
      const result = parseCommand('npx backlog task edit task-1 --title "Updated Task Title" --description "New description" --assignee "John Doe"');
      expect(result).toEqual({
        executable: 'npx',
        args: ['backlog', 'task', 'edit', 'task-1', '--title', 'Updated Task Title', '--description', 'New description', '--assignee', 'John Doe'],
      });
    });

    it('should handle complex task creation with all options', () => {
      const result = parseCommand('npx backlog task create "Feature Implementation" --description "Detailed description here" --assignee developer --status "in-progress" --priority high --plan "Step 1: Design\nStep 2: Implement"');
      expect(result).toEqual({
        executable: 'npx',
        args: [
          'backlog', 'task', 'create', 'Feature Implementation',
          '--description', 'Detailed description here',
          '--assignee', 'developer',
          '--status', 'in-progress',
          '--priority', 'high',
          '--plan', 'Step 1: Design\nStep 2: Implement'
        ],
      });
    });
  });

  describe('edge cases and error handling', () => {
    it('should handle unclosed quotes gracefully', () => {
      const result = parseCommand('npx backlog task create "Unclosed quote');
      // Should treat the entire rest as one argument
      expect(result).toEqual({
        executable: 'npx',
        args: ['backlog', 'task', 'create', 'Unclosed quote'],
      });
    });

    it('should handle multiple consecutive spaces', () => {
      const result = parseCommand('npx    backlog     task    create     "Title"');
      expect(result).toEqual({
        executable: 'npx',
        args: ['backlog', 'task', 'create', 'Title'],
      });
    });

    it('should handle quotes at different positions', () => {
      const result = parseCommand('npx backlog task create "Title" --description "Desc" arg "Final quoted"');
      expect(result).toEqual({
        executable: 'npx',
        args: ['backlog', 'task', 'create', 'Title', '--description', 'Desc', 'arg', 'Final quoted'],
      });
    });
  });

  describe('security and sanitization', () => {
    it('should sanitize unquoted arguments with dangerous characters', () => {
      const result = parseCommand('npx backlog task create title; rm -rf /');
      // The semicolon should be removed from 'title;' making it just 'title'
      expect(result.args).toContain('title');
      // But other dangerous arguments should still be parsed but sanitized
      expect(result.args).toContain('rm'); // rm itself isn't dangerous
      expect(result.args).toContain('-rf'); // -rf contains - which is not removed
      expect(result.args).toContain('/'); // / by itself is not removed, only ../ patterns
      // Dangerous characters should be removed from unquoted args
      expect(result.args.some(arg => arg.includes(';'))).toBe(false);
    });

    it('should preserve content in quoted arguments even with special characters', () => {
      const result = parseCommand('npx backlog task create "Task: Review & Merge (Priority #1)"');
      expect(result).toEqual({
        executable: 'npx',
        args: ['backlog', 'task', 'create', 'Task: Review & Merge (Priority #1)'],
      });
    });

    it('should remove directory traversal from all arguments', () => {
      const result = parseCommand('npx backlog task create "Title ../../../etc/passwd" --description "../secret"');
      expect(result.args[3]).toBe('Title etc/passwd'); // ../ patterns are removed
      expect(result.args[5]).toBe('secret'); // ../ pattern is removed
    });

    it('should handle arguments with mixed safe and unsafe characters', () => {
      const result = parseCommand('npx backlog task$list "Valid Title" unsafe&arg "Safe description"');
      // Unquoted args should be sanitized, quoted ones preserved (minus directory traversal)
      expect(result.args).toContain('Valid Title');
      expect(result.args).toContain('Safe description');
      expect(result.args.some(arg => arg.includes('&'))).toBe(false);
    });
  });
});