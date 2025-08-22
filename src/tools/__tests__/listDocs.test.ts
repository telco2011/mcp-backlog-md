/**
 * Unit tests for listDocs tool
 */
import { executeCommand } from '../../lib/commandExecutor.js';
import listDocsTool from '../listDocs.js';

// Mock the command executor
jest.mock('../../lib/commandExecutor.js');

const mockedExecuteCommand = executeCommand as jest.MockedFunction<typeof executeCommand>;

describe('listDocs tool', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedExecuteCommand.mockResolvedValue({
      content: [{ type: 'text' as const, text: 'doc-1: Test Document\ndoc-2: Another Document' }],
    });
  });

  describe('definition', () => {
    it('should have correct tool definition', () => {
      expect(listDocsTool.definition.name).toBe('listDocs');
      expect(listDocsTool.definition.title).toBe('Listdocs');
      expect(listDocsTool.definition.description).toBe('List documents in backlog.md');
    });
  });

  describe('execute', () => {
    const baseParams = { projectPath: '/test/project', plain: true };

    it('should execute with minimal parameters', async () => {
      await listDocsTool.execute(baseParams);

      expect(mockedExecuteCommand).toHaveBeenCalledWith({
        command: 'npx backlog doc list --plain',
        successMessage: 'Documents listed successfully',
        projectPath: '/test/project',
      });
    });

    it('should handle plain parameter', async () => {
      const params = { ...baseParams, plain: false };
      await listDocsTool.execute(params);

      expect(mockedExecuteCommand).toHaveBeenCalledWith({
        command: 'npx backlog doc list',
        successMessage: 'Documents listed successfully',
        projectPath: '/test/project',
      });
    });
  });
});
