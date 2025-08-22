/**
 * Test suite for viewDraft tool
 */
import { executeCommand } from '../../lib/commandExecutor.js';
import viewDraft from '../viewDraft.js';

// Mock the executeCommand function
jest.mock('../../lib/commandExecutor.js');
const mockedExecuteCommand = executeCommand as jest.MockedFunction<typeof executeCommand>;

describe('viewDraft tool', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedExecuteCommand.mockResolvedValue({
      content: [{ type: 'text', text: 'Draft viewed successfully' }],
    });
  });

  describe('definition', () => {
    it('should have correct tool definition', () => {
      expect(viewDraft.definition.name).toBe('viewDraft');
      expect(viewDraft.definition.title).toBe('Viewdraft');
      expect(viewDraft.definition.description).toBe('View a draft in backlog.md');
      expect(viewDraft.definition.inputSchema).toBeDefined();
    });
  });

  describe('execute', () => {
    const baseParams = {
      projectPath: '/test/project',
      id: 'draft-1',
      plain: true,
    };

    it('should view draft with plain mode', async () => {
      await viewDraft.execute(baseParams);

      expect(mockedExecuteCommand).toHaveBeenCalledWith({
        command: 'npx backlog draft draft-1 --plain',
        successMessage: 'Draft viewed successfully',
        projectPath: '/test/project',
      });
    });

    it('should view draft without plain mode', async () => {
      await viewDraft.execute({
        ...baseParams,
        plain: false,
      });

      expect(mockedExecuteCommand).toHaveBeenCalledWith({
        command: 'npx backlog draft draft-1',
        successMessage: 'Draft viewed successfully',
        projectPath: '/test/project',
      });
    });

    it('should handle different draft IDs', async () => {
      const testCases = [
        'draft-123',
        'epic-5',
        'bug-fix-42',
        'feature-xyz',
        'draft-with-dashes_and_underscores.123',
      ];

      for (const draftId of testCases) {
        await viewDraft.execute({
          ...baseParams,
          id: draftId,
        });

        expect(mockedExecuteCommand).toHaveBeenCalledWith({
          command: `npx backlog draft ${draftId} --plain`,
          successMessage: 'Draft viewed successfully',
          projectPath: '/test/project',
        });
      }
    });

    it('should handle command execution errors', async () => {
      mockedExecuteCommand.mockRejectedValue(new Error('Draft not found'));

      await expect(viewDraft.execute(baseParams)).rejects.toThrow('Draft not found');

      expect(mockedExecuteCommand).toHaveBeenCalledWith({
        command: 'npx backlog draft draft-1 --plain',
        successMessage: 'Draft viewed successfully',
        projectPath: '/test/project',
      });
    });

    it('should handle empty draft ID', async () => {
      await viewDraft.execute({
        ...baseParams,
        id: '',
      });

      expect(mockedExecuteCommand).toHaveBeenCalledWith({
        command: 'npx backlog draft  --plain',
        successMessage: 'Draft viewed successfully',
        projectPath: '/test/project',
      });
    });
  });
});