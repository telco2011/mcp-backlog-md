/**
 * Unit tests for createTask tool
 *
 * Tests the MCP tool that creates new tasks in backlog.md
 */
import { executeCommand } from '../../lib/commandExecutor.js';
import { _zSchema } from '../createTask.js';
import createTaskTool from '../createTask.js';

// Mock the command executor
jest.mock('../../lib/commandExecutor.js');

const mockedExecuteCommand = executeCommand as jest.MockedFunction<typeof executeCommand>;

describe('createTask tool', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedExecuteCommand.mockResolvedValue({
      content: [{ type: 'text' as const, text: 'Task created successfully with ID: task-1' }],
    });
  });

  describe('definition', () => {
    it('should have correct tool definition', () => {
      expect(createTaskTool.definition.name).toBe('createTask');
      expect(createTaskTool.definition.title).toBe('Createtask');
      expect(createTaskTool.definition.description).toBe('Create a new task in backlog.md');
      expect(createTaskTool.definition.inputSchema).toBeDefined();
    });

    it('should have required title field in schema', () => {
      const schema = createTaskTool.definition.inputSchema;
      expect(schema.title).toBeDefined();
      expect(schema.projectPath).toBeDefined();
    });

    it('should have optional fields in schema', () => {
      const schema = createTaskTool.definition.inputSchema;
      expect(schema.description).toBeDefined();
      expect(schema.assignee).toBeDefined();
      expect(schema.status).toBeDefined();
      expect(schema.labels).toBeDefined();
      expect(schema.priority).toBeDefined();
      expect(schema.acceptanceCriteria).toBeDefined();
      expect(schema.plan).toBeDefined();
      expect(schema.notes).toBeDefined();
      expect(schema.draft).toBeDefined();
      expect(schema.parent).toBeDefined();
      expect(schema.dependsOn).toBeDefined();
    });
  });

  describe('execute', () => {
    const baseParams = {
      title: 'Test Task',
      projectPath: '/test/project',
    };

    it('should execute with minimal required parameters', async () => {
      await createTaskTool.execute(baseParams);

      expect(mockedExecuteCommand).toHaveBeenCalledWith({
        command: 'npx backlog task create "Test Task"',
        successMessage: 'Task created successfully',
        projectPath: '/test/project',
      });
    });

    it('should include description when provided', async () => {
      const params = { ...baseParams, description: 'Test description' };
      await createTaskTool.execute(params);

      expect(mockedExecuteCommand).toHaveBeenCalledWith({
        command: 'npx backlog task create "Test Task" --description "Test description"',
        successMessage: 'Task created successfully',
        projectPath: '/test/project',
      });
    });

    it('should include assignee when provided', async () => {
      const params = { ...baseParams, assignee: 'john.doe' };
      await createTaskTool.execute(params);

      expect(mockedExecuteCommand).toHaveBeenCalledWith({
        command: 'npx backlog task create "Test Task" --assignee "john.doe"',
        successMessage: 'Task created successfully',
        projectPath: '/test/project',
      });
    });

    it('should include status when provided', async () => {
      const params = { ...baseParams, status: 'In Progress' };
      await createTaskTool.execute(params);

      expect(mockedExecuteCommand).toHaveBeenCalledWith({
        command: 'npx backlog task create "Test Task" --status "In Progress"',
        successMessage: 'Task created successfully',
        projectPath: '/test/project',
      });
    });

    it('should include labels when provided', async () => {
      const params = { ...baseParams, labels: 'bug,urgent,frontend' };
      await createTaskTool.execute(params);

      expect(mockedExecuteCommand).toHaveBeenCalledWith({
        command: 'npx backlog task create "Test Task" --labels "bug,urgent,frontend"',
        successMessage: 'Task created successfully',
        projectPath: '/test/project',
      });
    });

    it('should include priority when provided', async () => {
      const params = { ...baseParams, priority: 'high' };
      await createTaskTool.execute(params);

      expect(mockedExecuteCommand).toHaveBeenCalledWith({
        command: 'npx backlog task create "Test Task" --priority high',
        successMessage: 'Task created successfully',
        projectPath: '/test/project',
      });
    });

    it('should include plan when provided', async () => {
      const params = { ...baseParams, plan: 'Implementation plan details' };
      await createTaskTool.execute(params);

      expect(mockedExecuteCommand).toHaveBeenCalledWith({
        command: 'npx backlog task create "Test Task" --plan "Implementation plan details"',
        successMessage: 'Task created successfully',
        projectPath: '/test/project',
      });
    });

    it('should include acceptance criteria when provided', async () => {
      const params = { ...baseParams, acceptanceCriteria: 'AC1,AC2,AC3' };
      await createTaskTool.execute(params);

      expect(mockedExecuteCommand).toHaveBeenCalledWith({
        command: 'npx backlog task create "Test Task" --ac "AC1,AC2,AC3"',
        successMessage: 'Task created successfully',
        projectPath: '/test/project',
      });
    });

    it('should include notes when provided', async () => {
      const params = { ...baseParams, notes: 'Implementation notes' };
      await createTaskTool.execute(params);

      expect(mockedExecuteCommand).toHaveBeenCalledWith({
        command: 'npx backlog task create "Test Task" --notes "Implementation notes"',
        successMessage: 'Task created successfully',
        projectPath: '/test/project',
      });
    });

    it('should include dependencies when provided', async () => {
      const params = { ...baseParams, dependsOn: 'task-1,task-2' };
      await createTaskTool.execute(params);

      expect(mockedExecuteCommand).toHaveBeenCalledWith({
        command: 'npx backlog task create "Test Task" --dep "task-1,task-2"',
        successMessage: 'Task created successfully',
        projectPath: '/test/project',
      });
    });

    it('should include parent when provided', async () => {
      const params = { ...baseParams, parent: 'task-5' };
      await createTaskTool.execute(params);

      expect(mockedExecuteCommand).toHaveBeenCalledWith({
        command: 'npx backlog task create "Test Task" --parent task-5',
        successMessage: 'Task created successfully',
        projectPath: '/test/project',
      });
    });

    it('should include draft flag when provided', async () => {
      const params = { ...baseParams, draft: true };
      await createTaskTool.execute(params);

      expect(mockedExecuteCommand).toHaveBeenCalledWith({
        command: 'npx backlog task create "Test Task" --draft',
        successMessage: 'Task created successfully',
        projectPath: '/test/project',
      });
    });

    it('should not include draft flag when false', async () => {
      const params = { ...baseParams, draft: false };
      await createTaskTool.execute(params);

      expect(mockedExecuteCommand).toHaveBeenCalledWith({
        command: 'npx backlog task create "Test Task"',
        successMessage: 'Task created successfully',
        projectPath: '/test/project',
      });
    });

    it('should include desc when provided', async () => {
      const params = { ...baseParams, desc: 'Alternative description field' };
      await createTaskTool.execute(params);

      expect(mockedExecuteCommand).toHaveBeenCalledWith({
        command: 'npx backlog task create "Test Task" --desc "Alternative description field"',
        successMessage: 'Task created successfully',
        projectPath: '/test/project',
      });
    });

    it('should include ordinal when provided', async () => {
      const params = { ...baseParams, ordinal: 10 };
      await createTaskTool.execute(params);

      expect(mockedExecuteCommand).toHaveBeenCalledWith({
        command: 'npx backlog task create "Test Task" --ordinal 10',
        successMessage: 'Task created successfully',
        projectPath: '/test/project',
      });
    });

    it('should combine all parameters correctly', async () => {
      const params = {
        ...baseParams,
        description: 'Full test description',
        desc: 'Alternative desc',
        ordinal: 5,
        assignee: 'test.user',
        status: 'To Do',
        labels: 'test,example',
        priority: 'medium',
        plan: 'Detailed plan',
        acceptanceCriteria: 'AC1,AC2',
        notes: 'Important notes',
        dependsOn: 'task-1',
        parent: 'epic-1',
        draft: true,
      };

      await createTaskTool.execute(params);

      const expectedCommand = [
        'npx backlog task create "Test Task"',
        '--description "Full test description"',
        '--desc "Alternative desc"',
        '--ordinal 5',
        '--assignee "test.user"',
        '--status "To Do"',
        '--labels "test,example"',
        '--priority medium',
        '--plan "Detailed plan"',
        '--ac "AC1,AC2"',
        '--notes "Important notes"',
        '--dep "task-1"',
        '--parent epic-1',
        '--draft',
      ].join(' ');

      expect(mockedExecuteCommand).toHaveBeenCalledWith({
        command: expectedCommand,
        successMessage: 'Task created successfully',
        projectPath: '/test/project',
      });
    });

    it('should handle command execution errors', async () => {
      const error = new Error('Task creation failed');
      mockedExecuteCommand.mockRejectedValueOnce(error);

      await expect(createTaskTool.execute(baseParams)).rejects.toThrow('Task creation failed');
    });

    it('should properly quote strings with special characters', async () => {
      const params = {
        ...baseParams,
        title: 'Task with "quotes" and & special chars',
        description: 'Description with $variables and |pipes|',
      };

      await createTaskTool.execute(params);

      expect(mockedExecuteCommand).toHaveBeenCalledWith({
        command: 'npx backlog task create "Task with "quotes" and & special chars" --description "Description with $variables and |pipes|"',
        successMessage: 'Task created successfully',
        projectPath: '/test/project',
      });
    });

    it('should log execution details', async () => {
      const consoleInfoSpy = jest.spyOn(console, 'info').mockImplementation();

      await createTaskTool.execute(baseParams);

      expect(consoleInfoSpy).toHaveBeenCalledWith('Creating task', baseParams);

      consoleInfoSpy.mockRestore();
    });
  });

  describe('schema validation', () => {
    it('should validate required title field', () => {
      const validData = { title: 'Test', projectPath: '/path' };
      const invalidData = { title: '', projectPath: '/path' };

      expect(_zSchema.safeParse(validData).success).toBe(true);
      expect(_zSchema.safeParse(invalidData).success).toBe(false);
    });

    it('should validate projectPath field', () => {
      const validData = { title: 'Test', projectPath: '/path' };
      const invalidData = { title: 'Test' }; // missing projectPath

      expect(_zSchema.safeParse(validData).success).toBe(true);
      expect(_zSchema.safeParse(invalidData).success).toBe(false);
    });

    it('should allow all optional fields', () => {
      const dataWithAllFields = {
        title: 'Test',
        projectPath: '/path',
        description: 'desc',
        desc: 'alternative desc',
        ordinal: 1,
        assignee: 'user',
        status: 'status',
        labels: 'label1,label2',
        priority: 'high',
        acceptanceCriteria: 'ac1,ac2',
        plan: 'plan',
        notes: 'notes',
        draft: true,
        parent: 'parent-1',
        dependsOn: 'dep-1,dep-2',
      };

      expect(_zSchema.safeParse(dataWithAllFields).success).toBe(true);
    });
  });
});
