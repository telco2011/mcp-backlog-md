/**
 * Unit tests for demoteTask tool
 */
import { executeCommand } from '../../lib/commandExecutor.js';
import demoteTaskTool from '../demoteTask.js';

// Mock the command executor
jest.mock('../../lib/commandExecutor.js');

const mockedExecuteCommand = executeCommand as jest.MockedFunction<typeof executeCommand>;

describe('demoteTask tool', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedExecuteCommand.mockResolvedValue({
      content: [{ type: 'text' as const, text: 'Task demoted successfully' }],
    });
  });

  describe('definition', () => {
    it('should have correct tool definition', () => {
      expect(demoteTaskTool.definition.name).toBe('demoteTask');
      expect(demoteTaskTool.definition.title).toBe('Demotetask');
      expect(demoteTaskTool.definition.description).toBe('Demote a task to a draft in backlog.md');
    });
  });

  describe('execute', () => {
    const baseParams = { id: 'task-1', projectPath: '/test/project' };

    it('should execute with required parameters', async () => {
      await demoteTaskTool.execute(baseParams);

      expect(mockedExecuteCommand).toHaveBeenCalledWith({
        command: 'npx backlog task demote task-1',
        successMessage: 'Task demoted successfully',
        projectPath: '/test/project',
      });
    });
  });
});
