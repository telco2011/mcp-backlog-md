/**
 * Simple unit tests for listTasks tool
 */
import { executeCommand } from '../../lib/commandExecutor.js';
import listTasksTool from '../listTasks.js';

// Mock the command executor
jest.mock('../../lib/commandExecutor.js');

const mockedExecuteCommand = executeCommand as jest.MockedFunction<typeof executeCommand>;

describe('listTasks tool (simple)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedExecuteCommand.mockResolvedValue({
      content: [{ type: 'text' as const, text: 'task-1: Test Task\ntask-2: Another Task' }],
    });
  });

  describe('definition', () => {
    it('should have correct tool definition', () => {
      expect(listTasksTool.definition.name).toBe('listTasks');
      expect(listTasksTool.definition.title).toBe('Listtasks');
      expect(listTasksTool.definition.description).toBe('List tasks in backlog.md');
    });
  });

  describe('execute', () => {
    const baseParams = {
      projectPath: '/test/project',
      plain: true,
    };

    it('should execute with minimal parameters', async () => {
      await listTasksTool.execute(baseParams);

      expect(mockedExecuteCommand).toHaveBeenCalledWith({
        command: 'npx backlog task list --plain',
        successMessage: 'Tasks listed successfully',
        projectPath: '/test/project',
      });
    });

    it('should handle status filter', async () => {
      const params = { ...baseParams, status: 'done' };
      await listTasksTool.execute(params);

      expect(mockedExecuteCommand).toHaveBeenCalledWith({
        command: 'npx backlog task list --status "done" --plain',
        successMessage: 'Tasks listed successfully',
        projectPath: '/test/project',
      });
    });

    it('should handle errors', async () => {
      const error = new Error('List failed');
      mockedExecuteCommand.mockRejectedValueOnce(error);

      await expect(listTasksTool.execute(baseParams)).rejects.toThrow('List failed');
    });
  });
});
