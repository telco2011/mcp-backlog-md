/**
 * Unit tests for configList tool
 *
 * Tests the MCP tool that lists configuration in backlog.md
 */
import { executeCommand } from '../../lib/commandExecutor.js';
import configListTool from '../configList.js';

// Mock the command executor
jest.mock('../../lib/commandExecutor.js');

const mockedExecuteCommand = executeCommand as jest.MockedFunction<typeof executeCommand>;

describe('configList tool', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedExecuteCommand.mockResolvedValue({
      content: [{ type: 'text' as const, text: 'project.name=test-project\nproject.version=1.0.0' }],
    });
  });

  describe('definition', () => {
    it('should have correct tool definition', () => {
      expect(configListTool.definition.name).toBe('configList');
      expect(configListTool.definition.title).toBe('Configlist');
      expect(configListTool.definition.description).toBe('List the configuration in backlog.md');
      expect(configListTool.definition.inputSchema).toBeDefined();
    });

    it('should only require projectPath in schema', () => {
      const schema = configListTool.definition.inputSchema;
      expect(schema.projectPath).toBeDefined();
      expect(Object.keys(schema)).toEqual(['projectPath']);
    });
  });

  describe('execute', () => {
    const baseParams = {
      projectPath: '/test/project',
    };

    it('should execute config list command', async () => {
      await configListTool.execute(baseParams);

      expect(mockedExecuteCommand).toHaveBeenCalledWith({
        command: 'npx backlog config list',
        successMessage: 'Configuration listed successfully',
        projectPath: '/test/project',
      });
    });

    it('should handle command execution errors', async () => {
      const error = new Error('Config list failed');
      mockedExecuteCommand.mockRejectedValueOnce(error);

      await expect(configListTool.execute(baseParams)).rejects.toThrow('Config list failed');
    });

    it('should log execution details', async () => {
      const consoleInfoSpy = jest.spyOn(console, 'info').mockImplementation();

      await configListTool.execute(baseParams);

      expect(consoleInfoSpy).toHaveBeenCalledWith('Listing configuration');

      consoleInfoSpy.mockRestore();
    });

    it('should return result from executeCommand', async () => {
      const mockResult = {
        content: [{ type: 'text' as const, text: 'Configuration data' }],
      };
      mockedExecuteCommand.mockResolvedValueOnce(mockResult);

      const result = await configListTool.execute(baseParams);

      expect(result).toBe(mockResult);
    });
  });
});
