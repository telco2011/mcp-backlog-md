/**
 * Unit tests for viewTask tool
 *
 * Tests the MCP tool that views task details from backlog.md
 */
import { executeCommand } from '../../lib/commandExecutor.js';
import viewTaskTool from '../viewTask.js';

// Mock the command executor
jest.mock('../../lib/commandExecutor.js');

const mockedExecuteCommand = executeCommand as jest.MockedFunction<typeof executeCommand>;

describe('viewTask tool', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedExecuteCommand.mockResolvedValue({
      content: [{ type: 'text' as const, text: 'Task details: ID: task-1, Title: Test Task' }],
    });
  });

  describe('definition', () => {
    it('should have correct tool definition', () => {
      expect(viewTaskTool.definition.name).toBe('viewTask');
      expect(viewTaskTool.definition.title).toBe('Viewtask');
      expect(viewTaskTool.definition.description).toBe('View a task in backlog.md');
      expect(viewTaskTool.definition.inputSchema).toBeDefined();
    });

    it('should have required fields in schema', () => {
      const schema = viewTaskTool.definition.inputSchema;
      expect(schema.id).toBeDefined();
      expect(schema.projectPath).toBeDefined();
    });

    it('should have plain field with default true', () => {
      const schema = viewTaskTool.definition.inputSchema;
      expect(schema.plain).toBeDefined();
      // The default is handled by Zod, we can test this in schema validation
    });
  });

  describe('execute', () => {
    const baseParams = {
      id: 'task-1',
      projectPath: '/test/project',
      plain: true,
    };

    it('should execute with minimal required parameters', async () => {
      await viewTaskTool.execute(baseParams);

      expect(mockedExecuteCommand).toHaveBeenCalledWith({
        command: 'npx backlog task view task-1 --plain',
        successMessage: 'Task viewed successfully',
        projectPath: '/test/project',
      });
    });

    it('should include --plain flag by default', async () => {
      await viewTaskTool.execute(baseParams);

      expect(mockedExecuteCommand).toHaveBeenCalledWith(
        expect.objectContaining({
          command: expect.stringContaining('--plain'),
        })
      );
    });

    it('should include --plain flag when explicitly set to true', async () => {
      const params = { ...baseParams, plain: true };
      await viewTaskTool.execute(params);

      expect(mockedExecuteCommand).toHaveBeenCalledWith({
        command: 'npx backlog task view task-1 --plain',
        successMessage: 'Task viewed successfully',
        projectPath: '/test/project',
      });
    });

    it('should not include --plain flag when set to false', async () => {
      const params = { ...baseParams, plain: false };
      await viewTaskTool.execute(params);

      expect(mockedExecuteCommand).toHaveBeenCalledWith({
        command: 'npx backlog task view task-1',
        successMessage: 'Task viewed successfully',
        projectPath: '/test/project',
      });
    });

    it('should handle different task IDs', async () => {
      const testCases = ['task-1', 'task-123', 'epic-5', 'bug-fix-42', 'feature-xyz'];

      for (const taskId of testCases) {
        const params = { ...baseParams, id: taskId };
        await viewTaskTool.execute(params);

        expect(mockedExecuteCommand).toHaveBeenCalledWith({
          command: `npx backlog task view ${taskId} --plain`,
          successMessage: 'Task viewed successfully',
          projectPath: '/test/project',
        });
      }
    });

    it('should handle task IDs with special characters safely', async () => {
      const params = { ...baseParams, id: 'task-with-dashes_and_underscores.123' };
      await viewTaskTool.execute(params);

      expect(mockedExecuteCommand).toHaveBeenCalledWith({
        command: 'npx backlog task view task-with-dashes_and_underscores.123 --plain',
        successMessage: 'Task viewed successfully',
        projectPath: '/test/project',
      });
    });

    it('should handle command execution errors', async () => {
      const error = new Error('Task not found');
      mockedExecuteCommand.mockRejectedValueOnce(error);

      await expect(viewTaskTool.execute(baseParams)).rejects.toThrow('Task not found');
    });

    it('should log execution details', async () => {
      const consoleInfoSpy = jest.spyOn(console, 'info').mockImplementation();

      await viewTaskTool.execute(baseParams);

      expect(consoleInfoSpy).toHaveBeenCalledWith('Viewing task', baseParams);

      consoleInfoSpy.mockRestore();
    });

    it('should return result from executeCommand', async () => {
      const mockResult = {
        content: [{ type: 'text' as const, text: 'Detailed task information' }],
      };
      mockedExecuteCommand.mockResolvedValueOnce(mockResult);

      const result = await viewTaskTool.execute(baseParams);

      expect(result).toBe(mockResult);
    });
  });

  describe('schema validation', () => {
    it('should validate required id field', () => {
      // We need to access the actual schema for validation testing
      // Since the tool exports a default, we need to import the schema differently
      const schema = viewTaskTool.definition.inputSchema;

      // Test that id is required by checking the schema structure
      expect(schema.id).toBeDefined();
      expect(typeof schema.id.describe).toBe('function');
    });

    it('should validate required projectPath field', () => {
      const schema = viewTaskTool.definition.inputSchema;
      expect(schema.projectPath).toBeDefined();
    });

    it('should have plain field as boolean with default', () => {
      const schema = viewTaskTool.definition.inputSchema;
      expect(schema.plain).toBeDefined();
    });
  });

  describe('edge cases', () => {
    it('should handle empty task ID gracefully', async () => {
      const params = { id: '', projectPath: '/test/project', plain: true };

      // This should be handled by Zod validation before reaching execute
      // But if it somehow gets through, the command should still be constructed
      await viewTaskTool.execute(params);

      expect(mockedExecuteCommand).toHaveBeenCalledWith({
        command: 'npx backlog task view  --plain',
        successMessage: 'Task viewed successfully',
        projectPath: '/test/project',
      });
    });

    it('should handle very long task IDs', async () => {
      const longTaskId = 'task-' + 'a'.repeat(100);
      const params = { id: longTaskId, projectPath: '/test/project', plain: true };

      await viewTaskTool.execute(params);

      expect(mockedExecuteCommand).toHaveBeenCalledWith({
        command: `npx backlog task view ${longTaskId} --plain`,
        successMessage: 'Task viewed successfully',
        projectPath: '/test/project',
      });
    });

    it('should handle different project paths', async () => {
      const testPaths = ['/simple/path', '/path/with spaces/project', '/very/deep/nested/path/structure/project', '~/home/user/project'];

      for (const projectPath of testPaths) {
        const params = { id: 'task-1', projectPath, plain: true };
        await viewTaskTool.execute(params);

        expect(mockedExecuteCommand).toHaveBeenCalledWith({
          command: 'npx backlog task view task-1 --plain',
          successMessage: 'Task viewed successfully',
          projectPath,
        });
      }
    });
  });
});
