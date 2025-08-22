/**
 * Unit tests for promoteDraft tool
 */
import { executeCommand } from '../../lib/commandExecutor.js';
import promoteDraftTool from '../promoteDraft.js';

// Mock the command executor
jest.mock('../../lib/commandExecutor.js');

const mockedExecuteCommand = executeCommand as jest.MockedFunction<typeof executeCommand>;

describe('promoteDraft tool', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedExecuteCommand.mockResolvedValue({
      content: [{ type: 'text' as const, text: 'Draft promoted successfully' }],
    });
  });

  describe('definition', () => {
    it('should have correct tool definition', () => {
      expect(promoteDraftTool.definition.name).toBe('promoteDraft');
      expect(promoteDraftTool.definition.title).toBe('Promotedraft');
      expect(promoteDraftTool.definition.description).toBe('Promote a draft to a task in backlog.md');
    });
  });

  describe('execute', () => {
    const baseParams = { id: 'draft-1', projectPath: '/test/project' };

    it('should execute with required parameters', async () => {
      await promoteDraftTool.execute(baseParams);

      expect(mockedExecuteCommand).toHaveBeenCalledWith({
        command: 'npx backlog draft promote draft-1',
        successMessage: 'Draft promoted successfully',
        projectPath: '/test/project',
      });
    });
  });
});
