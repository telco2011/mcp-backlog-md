/**
 * Unit tests for createDraft tool
 */
import { executeCommand } from '../../lib/commandExecutor.js';
import createDraftTool from '../createDraft.js';

// Mock the command executor
jest.mock('../../lib/commandExecutor.js');

const mockedExecuteCommand = executeCommand as jest.MockedFunction<typeof executeCommand>;

describe('createDraft tool', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedExecuteCommand.mockResolvedValue({
      content: [{ type: 'text' as const, text: 'Draft created successfully' }],
    });
  });

  describe('definition', () => {
    it('should have correct tool definition', () => {
      expect(createDraftTool.definition.name).toBe('createDraft');
      expect(createDraftTool.definition.title).toBe('Createdraft');
      expect(createDraftTool.definition.description).toBe('Create a draft task in backlog.md');
    });
  });

  describe('execute', () => {
    const baseParams = {
      title: 'Test Draft',
      projectPath: '/test/project',
    };

    it('should execute with required parameters', async () => {
      await createDraftTool.execute(baseParams);

      expect(mockedExecuteCommand).toHaveBeenCalledWith({
        command: 'npx backlog draft create "Test Draft"',
        successMessage: 'Draft created successfully',
        projectPath: '/test/project',
      });
    });

    it('should handle optional parameters', async () => {
      const params = {
        ...baseParams,
        description: 'Test description',
        assignee: 'test.user',
        labels: 'draft,test',
      };

      await createDraftTool.execute(params);

      expect(mockedExecuteCommand).toHaveBeenCalledWith({
        command: 'npx backlog draft create "Test Draft" --description "Test description" --assignee "test.user" --labels "draft,test"',
        successMessage: 'Draft created successfully',
        projectPath: '/test/project',
      });
    });
  });
});
