/**
 * Test suite for listDrafts tool
 */
import { executeCommand } from '../../lib/commandExecutor.js';
import listDrafts from '../listDrafts.js';

// Mock the executeCommand function
jest.mock('../../lib/commandExecutor.js');
const mockedExecuteCommand = executeCommand as jest.MockedFunction<typeof executeCommand>;

describe('listDrafts tool', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedExecuteCommand.mockResolvedValue({
      content: [{ type: 'text', text: 'Drafts listed successfully' }],
    });
  });

  describe('definition', () => {
    it('should have correct tool definition', () => {
      expect(listDrafts.definition.name).toBe('listDrafts');
      expect(listDrafts.definition.title).toBe('Listdrafts');
      expect(listDrafts.definition.description).toBe('List drafts in backlog.md');
      expect(listDrafts.definition.inputSchema).toBeDefined();
    });
  });

  describe('execute', () => {
    const baseParams = {
      projectPath: '/test/project',
      plain: true,
    };

    it('should execute with default parameters', async () => {
      await listDrafts.execute(baseParams);

      expect(mockedExecuteCommand).toHaveBeenCalledWith({
        command: 'npx backlog draft list --plain',
        successMessage: 'Drafts listed successfully',
        projectPath: '/test/project',
      });
    });

    it('should handle sort parameter', async () => {
      await listDrafts.execute({
        ...baseParams,
        sort: 'priority',
      });

      expect(mockedExecuteCommand).toHaveBeenCalledWith({
        command: 'npx backlog draft list --sort priority --plain',
        successMessage: 'Drafts listed successfully',
        projectPath: '/test/project',
      });
    });

    it('should handle plain mode false', async () => {
      await listDrafts.execute({
        ...baseParams,
        plain: false,
      });

      expect(mockedExecuteCommand).toHaveBeenCalledWith({
        command: 'npx backlog draft list',
        successMessage: 'Drafts listed successfully',
        projectPath: '/test/project',
      });
    });

    it('should handle all parameters together', async () => {
      await listDrafts.execute({
        ...baseParams,
        sort: 'id',
        plain: true,
      });

      expect(mockedExecuteCommand).toHaveBeenCalledWith({
        command: 'npx backlog draft list --sort id --plain',
        successMessage: 'Drafts listed successfully',
        projectPath: '/test/project',
      });
    });

    it('should handle command execution errors', async () => {
      mockedExecuteCommand.mockRejectedValue(new Error('Command failed'));

      await expect(listDrafts.execute(baseParams)).rejects.toThrow('Command failed');

      expect(mockedExecuteCommand).toHaveBeenCalledWith({
        command: 'npx backlog draft list --plain',
        successMessage: 'Drafts listed successfully',
        projectPath: '/test/project',
      });
    });
  });
});