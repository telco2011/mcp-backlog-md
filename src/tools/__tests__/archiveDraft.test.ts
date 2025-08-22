/**
 * Test suite for archiveDraft tool
 */
import { executeCommand } from '../../lib/commandExecutor.js';
import archiveDraft from '../archiveDraft.js';

// Mock the executeCommand function
jest.mock('../../lib/commandExecutor.js');
const mockedExecuteCommand = executeCommand as jest.MockedFunction<typeof executeCommand>;

describe('archiveDraft tool', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedExecuteCommand.mockResolvedValue({
      content: [{ type: 'text', text: 'Draft(s) archived successfully' }],
    });
  });

  describe('definition', () => {
    it('should have correct tool definition', () => {
      expect(archiveDraft.definition.name).toBe('archiveDraft');
      expect(archiveDraft.definition.title).toBe('Archivedraft');
      expect(archiveDraft.definition.description).toBe('Archive a draft or drafts in backlog.md');
      expect(archiveDraft.definition.inputSchema).toBeDefined();
    });
  });

  describe('execute', () => {
    const baseParams = {
      projectPath: '/test/project',
    };

    it('should archive single draft by id', async () => {
      await archiveDraft.execute({
        ...baseParams,
        id: 'draft-1',
      });

      expect(mockedExecuteCommand).toHaveBeenCalledWith({
        command: 'npx backlog draft archive draft-1',
        successMessage: 'Draft(s) archived successfully',
        projectPath: '/test/project',
      });
    });

    it('should archive multiple drafts by ids', async () => {
      await archiveDraft.execute({
        ...baseParams,
        id: 'draft-1',
        ids: 'draft-1, draft-2, draft-3',
      });

      expect(mockedExecuteCommand).toHaveBeenCalledWith({
        command: 'npx backlog draft archive draft-1 draft-2 draft-3',
        successMessage: 'Draft(s) archived successfully',
        projectPath: '/test/project',
      });
    });

    it('should handle ids with extra whitespace', async () => {
      await archiveDraft.execute({
        ...baseParams,
        id: 'draft-1',
        ids: ' draft-1 ,  draft-2  , draft-3 ',
      });

      expect(mockedExecuteCommand).toHaveBeenCalledWith({
        command: 'npx backlog draft archive draft-1 draft-2 draft-3',
        successMessage: 'Draft(s) archived successfully',
        projectPath: '/test/project',
      });
    });

    it('should prioritize ids over single id when both provided', async () => {
      await archiveDraft.execute({
        ...baseParams,
        id: 'draft-should-be-ignored',
        ids: 'draft-1,draft-2',
      });

      expect(mockedExecuteCommand).toHaveBeenCalledWith({
        command: 'npx backlog draft archive draft-1 draft-2',
        successMessage: 'Draft(s) archived successfully',
        projectPath: '/test/project',
      });
    });

    it('should handle command execution errors', async () => {
      mockedExecuteCommand.mockRejectedValue(new Error('Archive failed'));

      await expect(
        archiveDraft.execute({
          ...baseParams,
          id: 'draft-1',
        })
      ).rejects.toThrow('Archive failed');

      expect(mockedExecuteCommand).toHaveBeenCalledWith({
        command: 'npx backlog draft archive draft-1',
        successMessage: 'Draft(s) archived successfully',
        projectPath: '/test/project',
      });
    });
  });
});
