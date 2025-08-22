/**
 * Unit tests for editTask tool
 */
import { executeCommand } from '../../lib/commandExecutor.js';
import editTaskTool from '../editTask.js';

// Mock the command executor
jest.mock('../../lib/commandExecutor.js');

const mockedExecuteCommand = executeCommand as jest.MockedFunction<typeof executeCommand>;

describe('editTask tool', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedExecuteCommand.mockResolvedValue({
      content: [{ type: 'text' as const, text: 'Task edited successfully' }],
    });
  });

  describe('definition', () => {
    it('should have correct tool definition', () => {
      expect(editTaskTool.definition.name).toBe('editTask');
      expect(editTaskTool.definition.title).toBe('Edittask');
      expect(editTaskTool.definition.description).toBe('Edit an existing task in backlog.md');
    });
  });

  describe('execute', () => {
    const baseParams = { id: 'task-1', projectPath: '/test/project' };

    it('should execute with required parameters', async () => {
      await editTaskTool.execute(baseParams);

      expect(mockedExecuteCommand).toHaveBeenCalledWith({
        command: 'npx backlog task edit task-1',
        successMessage: 'Task edited successfully',
        projectPath: '/test/project',
      });
    });

    it('should handle optional title parameter', async () => {
      const params = { ...baseParams, title: 'Updated Title' };
      await editTaskTool.execute(params);

      expect(mockedExecuteCommand).toHaveBeenCalledWith({
        command: 'npx backlog task edit task-1 --title "Updated Title"',
        successMessage: 'Task edited successfully',
        projectPath: '/test/project',
      });
    });

    it('should handle command execution errors', async () => {
      const error = new Error('Task not found');
      mockedExecuteCommand.mockRejectedValueOnce(error);

      await expect(editTaskTool.execute(baseParams)).rejects.toThrow('Task not found');
    });
  });
});
