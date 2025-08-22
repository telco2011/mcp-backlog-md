/**
 * Unit tests for cleanup tool
 *
 * Tests the MCP tool that cleans up done tasks in backlog.md
 */
import { executeCommand } from '../../lib/commandExecutor.js';
import cleanupTool from '../cleanup.js';

// Mock the command executor
jest.mock('../../lib/commandExecutor.js');

const mockedExecuteCommand = executeCommand as jest.MockedFunction<typeof executeCommand>;

describe('cleanup tool', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedExecuteCommand.mockResolvedValue({
      content: [{ type: 'text' as const, text: 'Cleanup completed. 5 tasks moved to archive.' }],
    });
  });

  describe('definition', () => {
    it('should have correct tool definition', () => {
      expect(cleanupTool.definition.name).toBe('cleanup');
      expect(cleanupTool.definition.title).toBe('Cleanup');
      expect(cleanupTool.definition.description).toBe('Cleanup done tasks in backlog.md');
      expect(cleanupTool.definition.inputSchema).toBeDefined();
    });

    it('should only require projectPath in schema', () => {
      const schema = cleanupTool.definition.inputSchema;
      expect(schema.projectPath).toBeDefined();
      // Should not have other required fields
      expect(Object.keys(schema)).toEqual(['projectPath']);
    });
  });

  describe('execute', () => {
    const baseParams = {
      projectPath: '/test/project',
    };

    it('should execute cleanup command', async () => {
      await cleanupTool.execute(baseParams);

      expect(mockedExecuteCommand).toHaveBeenCalledWith({
        command: 'npx backlog cleanup',
        successMessage: 'Cleanup successful',
        projectPath: '/test/project',
      });
    });

    it('should handle command execution errors', async () => {
      const error = new Error('Cleanup failed');
      mockedExecuteCommand.mockRejectedValueOnce(error);

      await expect(cleanupTool.execute(baseParams)).rejects.toThrow('Cleanup failed');
    });

    it('should log execution details', async () => {
      const consoleInfoSpy = jest.spyOn(console, 'info').mockImplementation();

      await cleanupTool.execute(baseParams);

      expect(consoleInfoSpy).toHaveBeenCalledWith('Cleaning up tasks');

      consoleInfoSpy.mockRestore();
    });

    it('should return result from executeCommand', async () => {
      const mockResult = {
        content: [{ type: 'text' as const, text: 'Cleanup operation completed' }],
      };
      mockedExecuteCommand.mockResolvedValueOnce(mockResult);

      const result = await cleanupTool.execute(baseParams);

      expect(result).toBe(mockResult);
    });
  });

  describe('edge cases', () => {
    it('should handle different project paths', async () => {
      const testPaths = ['/simple/path', '/path/with spaces/project', '/very/deep/nested/path/project'];

      for (const projectPath of testPaths) {
        jest.clearAllMocks();
        const params = { projectPath };
        await cleanupTool.execute(params);

        expect(mockedExecuteCommand).toHaveBeenCalledWith({
          command: 'npx backlog cleanup',
          successMessage: 'Cleanup successful',
          projectPath,
        });
      }
    });
  });
});
