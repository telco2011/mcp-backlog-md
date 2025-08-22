/**
 * Test suite for viewBoard tool
 */
import { executeCommand } from '../../lib/commandExecutor.js';
import viewBoard from '../viewBoard.js';

// Mock the executeCommand function
jest.mock('../../lib/commandExecutor.js');
const mockedExecuteCommand = executeCommand as jest.MockedFunction<typeof executeCommand>;

describe('viewBoard tool', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedExecuteCommand.mockResolvedValue({
      content: [{ type: 'text', text: 'Board viewed successfully' }],
    });
  });

  describe('definition', () => {
    it('should have correct tool definition', () => {
      expect(viewBoard.definition.name).toBe('viewBoard');
      expect(viewBoard.definition.title).toBe('Viewboard');
      expect(viewBoard.definition.description).toBe('View the board in backlog.md');
      expect(viewBoard.definition.inputSchema).toBeDefined();
    });
  });

  describe('execute', () => {
    const baseParams = {
      projectPath: '/test/project',
      plain: true,
    };

    it('should view board with plain mode by default', async () => {
      await viewBoard.execute(baseParams);

      expect(mockedExecuteCommand).toHaveBeenCalledWith({
        command: 'npx backlog board view --plain',
        successMessage: 'Board viewed successfully',
        projectPath: '/test/project',
      });
    });

    it('should view board without plain mode when disabled', async () => {
      await viewBoard.execute({
        ...baseParams,
        plain: false,
      });

      expect(mockedExecuteCommand).toHaveBeenCalledWith({
        command: 'npx backlog board view',
        successMessage: 'Board viewed successfully',
        projectPath: '/test/project',
      });
    });

    it('should handle plain mode explicitly set to true', async () => {
      await viewBoard.execute({
        ...baseParams,
        plain: true,
      });

      expect(mockedExecuteCommand).toHaveBeenCalledWith({
        command: 'npx backlog board view --plain',
        successMessage: 'Board viewed successfully',
        projectPath: '/test/project',
      });
    });

    it('should handle different project paths', async () => {
      const testCases = ['/path/to/project', '/home/user/workspace/project', '/tmp/test-project', '/root/project-with-dashes'];

      for (const projectPath of testCases) {
        await viewBoard.execute({
          ...baseParams,
          projectPath,
        });

        expect(mockedExecuteCommand).toHaveBeenCalledWith({
          command: 'npx backlog board view --plain',
          successMessage: 'Board viewed successfully',
          projectPath,
        });
      }
    });

    it('should handle command execution errors', async () => {
      mockedExecuteCommand.mockRejectedValue(new Error('Board not found'));

      await expect(viewBoard.execute(baseParams)).rejects.toThrow('Board not found');

      expect(mockedExecuteCommand).toHaveBeenCalledWith({
        command: 'npx backlog board view --plain',
        successMessage: 'Board viewed successfully',
        projectPath: '/test/project',
      });
    });

    it('should handle minimal parameters', async () => {
      await viewBoard.execute({
        projectPath: '/minimal/project',
        plain: false,
      });

      expect(mockedExecuteCommand).toHaveBeenCalledWith({
        command: 'npx backlog board view',
        successMessage: 'Board viewed successfully',
        projectPath: '/minimal/project',
      });
    });
  });
});
