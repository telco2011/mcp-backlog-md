/**
 * Unit tests for viewDoc tool
 */
import { executeCommand } from '../../lib/commandExecutor.js';
import viewDocTool from '../viewDoc.js';

// Mock the command executor
jest.mock('../../lib/commandExecutor.js');

const mockedExecuteCommand = executeCommand as jest.MockedFunction<typeof executeCommand>;

describe('viewDoc tool', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedExecuteCommand.mockResolvedValue({
      content: [{ type: 'text' as const, text: 'Document content here' }],
    });
  });

  describe('definition', () => {
    it('should have correct tool definition', () => {
      expect(viewDocTool.definition.name).toBe('viewDoc');
      expect(viewDocTool.definition.title).toBe('Viewdoc');
      expect(viewDocTool.definition.description).toBe('View a document in backlog.md');
    });
  });

  describe('execute', () => {
    const baseParams = { id: 'doc-1', projectPath: '/test/project' };

    it('should execute with required parameters', async () => {
      await viewDocTool.execute(baseParams);

      expect(mockedExecuteCommand).toHaveBeenCalledWith({
        command: 'npx backlog doc view doc-1',
        successMessage: 'Document viewed successfully',
        projectPath: '/test/project',
      });
    });

    it('should handle execution errors', async () => {
      const error = new Error('Document not found');
      mockedExecuteCommand.mockRejectedValueOnce(error);

      await expect(viewDocTool.execute(baseParams)).rejects.toThrow('Document not found');
    });
  });
});
