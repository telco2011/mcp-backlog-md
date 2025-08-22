/**
 * Simple unit tests for archiveTask tool
 */
import { executeCommand } from '../../lib/commandExecutor.js';
import archiveTaskTool from '../archiveTask.js';

// Mock the command executor
jest.mock('../../lib/commandExecutor.js');

const mockedExecuteCommand = executeCommand as jest.MockedFunction<typeof executeCommand>;

describe('archiveTask tool (simple)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedExecuteCommand.mockResolvedValue({
      content: [{ type: 'text' as const, text: 'Task task-1 archived successfully' }],
    });
  });

  describe('definition', () => {
    it('should have correct tool definition', () => {
      expect(archiveTaskTool.definition.name).toBe('archiveTask');
      expect(archiveTaskTool.definition.title).toBe('Archivetask');
      expect(archiveTaskTool.definition.description).toBe('Archive a task, or tasks, in backlog.md');
    });
  });

  describe('execute', () => {
    it('should archive single task using id parameter', async () => {
      const params = {
        id: 'task-1',
        projectPath: '/test/project',
      };

      await archiveTaskTool.execute(params);

      expect(mockedExecuteCommand).toHaveBeenCalledWith({
        command: 'npx backlog task archive task-1',
        successMessage: 'Task task-1 archived successfully',
        projectPath: '/test/project',
      });
    });

    it('should handle command execution errors', async () => {
      const error = new Error('Archive failed');
      mockedExecuteCommand.mockRejectedValueOnce(error);

      const params = {
        id: 'task-1',
        projectPath: '/test/project',
      };

      const result = await archiveTaskTool.execute(params);
      expect(result.content).toEqual([]);
      expect(result.result).toContain('Failed to archive 1 tasks');
    });
  });
});
