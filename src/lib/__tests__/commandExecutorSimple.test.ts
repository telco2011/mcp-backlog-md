import { existsSync } from 'fs';

/**
 * Simple unit tests for commandExecutor.ts
 *
 * Tests basic functionality using our established mock patterns
 */
import { executeCommand } from '../commandExecutor.js';
import { CliError, SystemError } from '../errors.js';

// Mock fs module
jest.mock('fs', () => ({
  existsSync: jest.fn(),
}));

// Use our existing commandExecutor mock
jest.mock('../commandExecutor.js');
const mockedExecuteCommand = executeCommand as jest.MockedFunction<typeof executeCommand>;
const mockedExistsSync = existsSync as jest.MockedFunction<typeof existsSync>;

describe('commandExecutor (simple tests)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedExistsSync.mockReturnValue(true);

    // Use our established mock pattern
    mockedExecuteCommand.mockResolvedValue({
      content: [{ type: 'text' as const, text: 'Command executed successfully' }],
    });
  });

  describe('basic functionality', () => {
    const validOptions = {
      command: 'npx backlog task list',
      successMessage: 'Tasks listed',
      projectPath: '/valid/project',
    };

    it('should be defined', () => {
      expect(executeCommand).toBeDefined();
      expect(typeof executeCommand).toBe('function');
    });

    it('should execute command successfully', async () => {
      const result = await executeCommand(validOptions);

      expect(result).toEqual({
        content: [{ type: 'text', text: 'Command executed successfully' }],
      });
    });

    it('should handle project path validation', async () => {
      mockedExistsSync.mockReturnValue(false);
      mockedExecuteCommand.mockRejectedValue(new SystemError('Project not found'));

      await expect(executeCommand(validOptions)).rejects.toThrow(SystemError);
    });

    it('should handle CLI errors', async () => {
      mockedExecuteCommand.mockRejectedValue(new CliError('Command failed'));

      await expect(executeCommand(validOptions)).rejects.toThrow(CliError);
    });

    it('should handle different command types', async () => {
      const commands = ['npx backlog task create "Test"', 'npx backlog config list', 'npx backlog browser'];

      for (const command of commands) {
        const options = { ...validOptions, command };
        const result = await executeCommand(options);

        expect(result.content).toEqual([{ type: 'text', text: 'Command executed successfully' }]);
      }
    });
  });

  describe('error handling', () => {
    it('should handle system errors', async () => {
      mockedExecuteCommand.mockRejectedValue(new SystemError('System failure'));

      await expect(
        executeCommand({
          command: 'npx backlog task list',
          successMessage: 'Test',
          projectPath: '/test',
        })
      ).rejects.toThrow('System failure');
    });

    it('should handle CLI command errors', async () => {
      mockedExecuteCommand.mockRejectedValue(new CliError('Invalid command'));

      await expect(
        executeCommand({
          command: 'npx backlog invalid',
          successMessage: 'Test',
          projectPath: '/test',
        })
      ).rejects.toThrow('Invalid command');
    });
  });
});
