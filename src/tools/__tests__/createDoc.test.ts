/**
 * Unit tests for createDoc tool
 */
import { executeCommand } from '../../lib/commandExecutor.js';
import createDocTool from '../createDoc.js';

// Mock the command executor
jest.mock('../../lib/commandExecutor.js');

const mockedExecuteCommand = executeCommand as jest.MockedFunction<typeof executeCommand>;

describe('createDoc tool', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedExecuteCommand.mockResolvedValue({
      content: [{ type: 'text' as const, text: 'Document created successfully' }],
    });
  });

  describe('definition', () => {
    it('should have correct tool definition', () => {
      expect(createDocTool.definition.name).toBe('createDoc');
      expect(createDocTool.definition.title).toBe('Createdoc');
      expect(createDocTool.definition.description).toBe('Create a new document in backlog.md');
    });
  });

  describe('execute', () => {
    const baseParams = {
      title: 'Test Document',
      projectPath: '/test/project',
    };

    it('should execute with required parameters', async () => {
      await createDocTool.execute(baseParams);

      expect(mockedExecuteCommand).toHaveBeenCalledWith({
        command: 'npx backlog doc create "Test Document"',
        successMessage: 'Document created successfully',
        projectPath: '/test/project',
      });
    });

    it('should handle optional parameters', async () => {
      const params = {
        ...baseParams,
        type: 'specification',
        path: '/docs/specs',
      };

      await createDocTool.execute(params);

      expect(mockedExecuteCommand).toHaveBeenCalledWith({
        command: 'npx backlog doc create "Test Document" --path "/docs/specs" --type "specification"',
        successMessage: 'Document created successfully',
        projectPath: '/test/project',
      });
    });
  });
});
