/**
 * Test suite for configGet tool
 */
import { executeCommand } from '../../lib/commandExecutor.js';
import configGet from '../configGet.js';

// Mock the executeCommand function
jest.mock('../../lib/commandExecutor.js');
const mockedExecuteCommand = executeCommand as jest.MockedFunction<typeof executeCommand>;

describe('configGet tool', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedExecuteCommand.mockResolvedValue({
      content: [{ type: 'text', text: 'Configuration value retrieved successfully' }],
    });
  });

  describe('definition', () => {
    it('should have correct tool definition', () => {
      expect(configGet.definition.name).toBe('configGet');
      expect(configGet.definition.title).toBe('Configget');
      expect(configGet.definition.description).toBe('Get a configuration value in backlog.md');
      expect(configGet.definition.inputSchema).toBeDefined();
    });
  });

  describe('execute', () => {
    const baseParams = {
      projectPath: '/test/project',
      key: 'board.columns',
    };

    it('should get configuration value with basic key', async () => {
      await configGet.execute(baseParams);

      expect(mockedExecuteCommand).toHaveBeenCalledWith({
        command: 'npx backlog config get board.columns',
        successMessage: 'Configuration value retrieved successfully',
        projectPath: '/test/project',
      });
    });

    it('should handle different configuration keys', async () => {
      const testCases = ['board.columns', 'defaults.assignee', 'defaults.priority', 'board.title', 'github.token', 'export.format'];

      for (const key of testCases) {
        await configGet.execute({
          ...baseParams,
          key,
        });

        expect(mockedExecuteCommand).toHaveBeenCalledWith({
          command: `npx backlog config get ${key}`,
          successMessage: 'Configuration value retrieved successfully',
          projectPath: '/test/project',
        });
      }
    });

    it('should handle keys with special characters', async () => {
      const testCases = ['key-with-dashes', 'key_with_underscores', 'key.with.dots', 'key123', 'UPPERCASE_KEY'];

      for (const key of testCases) {
        await configGet.execute({
          ...baseParams,
          key,
        });

        expect(mockedExecuteCommand).toHaveBeenCalledWith({
          command: `npx backlog config get ${key}`,
          successMessage: 'Configuration value retrieved successfully',
          projectPath: '/test/project',
        });
      }
    });

    it('should handle different project paths', async () => {
      const testCases = ['/path/to/project', '/home/user/workspace/project', '/tmp/test-project', '/root/project-with-dashes'];

      for (const projectPath of testCases) {
        await configGet.execute({
          ...baseParams,
          projectPath,
        });

        expect(mockedExecuteCommand).toHaveBeenCalledWith({
          command: 'npx backlog config get board.columns',
          successMessage: 'Configuration value retrieved successfully',
          projectPath,
        });
      }
    });

    it('should handle command execution errors', async () => {
      mockedExecuteCommand.mockRejectedValue(new Error('Configuration key not found'));

      await expect(configGet.execute(baseParams)).rejects.toThrow('Configuration key not found');

      expect(mockedExecuteCommand).toHaveBeenCalledWith({
        command: 'npx backlog config get board.columns',
        successMessage: 'Configuration value retrieved successfully',
        projectPath: '/test/project',
      });
    });

    it('should handle empty key', async () => {
      await configGet.execute({
        ...baseParams,
        key: '',
      });

      expect(mockedExecuteCommand).toHaveBeenCalledWith({
        command: 'npx backlog config get ',
        successMessage: 'Configuration value retrieved successfully',
        projectPath: '/test/project',
      });
    });

    it('should handle key with spaces', async () => {
      await configGet.execute({
        ...baseParams,
        key: 'key with spaces',
      });

      expect(mockedExecuteCommand).toHaveBeenCalledWith({
        command: 'npx backlog config get key with spaces',
        successMessage: 'Configuration value retrieved successfully',
        projectPath: '/test/project',
      });
    });

    it('should handle minimal parameters', async () => {
      await configGet.execute({
        projectPath: '/minimal/project',
        key: 'minimal.key',
      });

      expect(mockedExecuteCommand).toHaveBeenCalledWith({
        command: 'npx backlog config get minimal.key',
        successMessage: 'Configuration value retrieved successfully',
        projectPath: '/minimal/project',
      });
    });
  });
});
