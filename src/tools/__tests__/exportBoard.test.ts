/**
 * Unit tests for exportBoard tool
 */
import { executeCommand } from '../../lib/commandExecutor.js';
import exportBoardTool from '../exportBoard.js';

// Mock the command executor
jest.mock('../../lib/commandExecutor.js');

const mockedExecuteCommand = executeCommand as jest.MockedFunction<typeof executeCommand>;

describe('exportBoard tool', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedExecuteCommand.mockResolvedValue({
      content: [{ type: 'text' as const, text: 'Board exported successfully' }],
    });
  });

  describe('definition', () => {
    it('should have correct tool definition', () => {
      expect(exportBoardTool.definition.name).toBe('exportBoard');
      expect(exportBoardTool.definition.title).toBe('Exportboard');
      expect(exportBoardTool.definition.description).toBe('Export the Kanban board to a markdown file');
    });
  });

  describe('execute', () => {
    const baseParams = { projectPath: '/test/project' };

    it('should execute with minimal parameters', async () => {
      await exportBoardTool.execute(baseParams);

      expect(mockedExecuteCommand).toHaveBeenCalledWith({
        command: 'npx backlog board export',
        successMessage: 'Board exported successfully',
        projectPath: '/test/project',
      });
    });

    it('should handle optional parameters', async () => {
      const params = {
        ...baseParams,
        file: 'custom-board.md',
        exportVersion: '1.0.0',
        readme: true,
        force: true,
      };

      await exportBoardTool.execute(params);

      expect(mockedExecuteCommand).toHaveBeenCalledWith({
        command: 'npx backlog board export --file custom-board.md --force --readme --export-version 1.0.0',
        successMessage: 'Board exported successfully',
        projectPath: '/test/project',
      });
    });
  });
});
