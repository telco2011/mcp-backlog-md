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

    it('should handle desc parameter', async () => {
      const params = { ...baseParams, desc: 'Alternative description' };
      await editTaskTool.execute(params);

      expect(mockedExecuteCommand).toHaveBeenCalledWith({
        command: 'npx backlog task edit task-1 --desc "Alternative description"',
        successMessage: 'Task edited successfully',
        projectPath: '/test/project',
      });
    });

    it('should handle ordinal parameter', async () => {
      const params = { ...baseParams, ordinal: 5 };
      await editTaskTool.execute(params);

      expect(mockedExecuteCommand).toHaveBeenCalledWith({
        command: 'npx backlog task edit task-1 --ordinal 5',
        successMessage: 'Task edited successfully',
        projectPath: '/test/project',
      });
    });

    it('should handle checkAc parameter', async () => {
      const params = { ...baseParams, checkAc: 2 };
      await editTaskTool.execute(params);

      expect(mockedExecuteCommand).toHaveBeenCalledWith({
        command: 'npx backlog task edit task-1 --check-ac 2',
        successMessage: 'Task edited successfully',
        projectPath: '/test/project',
      });
    });

    it('should handle unCheckAc parameter', async () => {
      const params = { ...baseParams, unCheckAc: 3 };
      await editTaskTool.execute(params);

      expect(mockedExecuteCommand).toHaveBeenCalledWith({
        command: 'npx backlog task edit task-1 --uncheck-ac 3',
        successMessage: 'Task edited successfully',
        projectPath: '/test/project',
      });
    });

    it('should handle removeAc parameter', async () => {
      const params = { ...baseParams, removeAc: 1 };
      await editTaskTool.execute(params);

      expect(mockedExecuteCommand).toHaveBeenCalledWith({
        command: 'npx backlog task edit task-1 --remove-ac 1',
        successMessage: 'Task edited successfully',
        projectPath: '/test/project',
      });
    });

    it('should handle multiple parameters together', async () => {
      const params = {
        ...baseParams,
        title: 'New Title',
        desc: 'New description',
        ordinal: 10,
        assignee: 'john.doe',
        status: 'in-progress',
        priority: 'high',
        checkAc: 1,
      };
      await editTaskTool.execute(params);

      expect(mockedExecuteCommand).toHaveBeenCalledWith({
        command:
          'npx backlog task edit task-1 --title "New Title" --desc "New description" --ordinal 10 --assignee "john.doe" --status "in-progress" --priority high --check-ac 1',
        successMessage: 'Task edited successfully',
        projectPath: '/test/project',
      });
    });

    it('should handle all remaining optional parameters', async () => {
      const params = {
        ...baseParams,
        description: 'Standard description',
        assignee: 'jane.doe',
        status: 'completed',
        label: 'bug,critical',
        priority: 'high',
        addLabel: 'urgent',
        removeLabel: 'draft',
        acceptanceCriteria: 'Must pass all tests',
        addAc: 'Must have documentation',
        plan: 'Implementation strategy',
        notes: 'Technical notes',
        dependsOn: 'task-2,task-3',
        parent: 'epic-42',
      };
      await editTaskTool.execute(params);

      expect(mockedExecuteCommand).toHaveBeenCalledWith({
        command:
          'npx backlog task edit task-1 --description "Standard description" --assignee "jane.doe" --status "completed" --label "bug,critical" --priority high --add-label "urgent" --remove-label "draft" --ac "Must pass all tests" --ac "Must have documentation" --plan "Implementation strategy" --notes "Technical notes" --dep "task-2,task-3" --parent epic-42',
        successMessage: 'Task edited successfully',
        projectPath: '/test/project',
      });
    });

    it('should handle each parameter individually to test all branches', async () => {
      // Test description branch
      await editTaskTool.execute({ ...baseParams, description: 'Test desc' });
      expect(mockedExecuteCommand).toHaveBeenLastCalledWith({
        command: 'npx backlog task edit task-1 --description "Test desc"',
        successMessage: 'Task edited successfully',
        projectPath: '/test/project',
      });

      // Test assignee branch
      await editTaskTool.execute({ ...baseParams, assignee: 'user123' });
      expect(mockedExecuteCommand).toHaveBeenLastCalledWith({
        command: 'npx backlog task edit task-1 --assignee "user123"',
        successMessage: 'Task edited successfully',
        projectPath: '/test/project',
      });

      // Test status branch
      await editTaskTool.execute({ ...baseParams, status: 'in-review' });
      expect(mockedExecuteCommand).toHaveBeenLastCalledWith({
        command: 'npx backlog task edit task-1 --status "in-review"',
        successMessage: 'Task edited successfully',
        projectPath: '/test/project',
      });

      // Test label branch
      await editTaskTool.execute({ ...baseParams, label: 'tag1,tag2' });
      expect(mockedExecuteCommand).toHaveBeenLastCalledWith({
        command: 'npx backlog task edit task-1 --label "tag1,tag2"',
        successMessage: 'Task edited successfully',
        projectPath: '/test/project',
      });

      // Test priority branch
      await editTaskTool.execute({ ...baseParams, priority: 'low' });
      expect(mockedExecuteCommand).toHaveBeenLastCalledWith({
        command: 'npx backlog task edit task-1 --priority low',
        successMessage: 'Task edited successfully',
        projectPath: '/test/project',
      });

      // Test addLabel branch
      await editTaskTool.execute({ ...baseParams, addLabel: 'new-tag' });
      expect(mockedExecuteCommand).toHaveBeenLastCalledWith({
        command: 'npx backlog task edit task-1 --add-label "new-tag"',
        successMessage: 'Task edited successfully',
        projectPath: '/test/project',
      });

      // Test removeLabel branch
      await editTaskTool.execute({ ...baseParams, removeLabel: 'old-tag' });
      expect(mockedExecuteCommand).toHaveBeenLastCalledWith({
        command: 'npx backlog task edit task-1 --remove-label "old-tag"',
        successMessage: 'Task edited successfully',
        projectPath: '/test/project',
      });

      // Test acceptanceCriteria branch
      await editTaskTool.execute({ ...baseParams, acceptanceCriteria: 'Criterion 1' });
      expect(mockedExecuteCommand).toHaveBeenLastCalledWith({
        command: 'npx backlog task edit task-1 --ac "Criterion 1"',
        successMessage: 'Task edited successfully',
        projectPath: '/test/project',
      });

      // Test addAc branch
      await editTaskTool.execute({ ...baseParams, addAc: 'Additional criterion' });
      expect(mockedExecuteCommand).toHaveBeenLastCalledWith({
        command: 'npx backlog task edit task-1 --ac "Additional criterion"',
        successMessage: 'Task edited successfully',
        projectPath: '/test/project',
      });

      // Test plan branch
      await editTaskTool.execute({ ...baseParams, plan: 'Step-by-step plan' });
      expect(mockedExecuteCommand).toHaveBeenLastCalledWith({
        command: 'npx backlog task edit task-1 --plan "Step-by-step plan"',
        successMessage: 'Task edited successfully',
        projectPath: '/test/project',
      });

      // Test notes branch
      await editTaskTool.execute({ ...baseParams, notes: 'Important notes' });
      expect(mockedExecuteCommand).toHaveBeenLastCalledWith({
        command: 'npx backlog task edit task-1 --notes "Important notes"',
        successMessage: 'Task edited successfully',
        projectPath: '/test/project',
      });

      // Test dependsOn branch
      await editTaskTool.execute({ ...baseParams, dependsOn: 'task-x,task-y' });
      expect(mockedExecuteCommand).toHaveBeenLastCalledWith({
        command: 'npx backlog task edit task-1 --dep "task-x,task-y"',
        successMessage: 'Task edited successfully',
        projectPath: '/test/project',
      });

      // Test parent branch
      await editTaskTool.execute({ ...baseParams, parent: 'parent-task' });
      expect(mockedExecuteCommand).toHaveBeenLastCalledWith({
        command: 'npx backlog task edit task-1 --parent parent-task',
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
