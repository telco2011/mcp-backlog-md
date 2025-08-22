/**
 * Unit tests for configSet tool
 *
 * Tests the MCP tool that sets configuration values in backlog.md
 */
import { executeCommand } from '../../lib/commandExecutor.js';
import configSetTool from '../configSet.js';

// Mock the command executor
jest.mock('../../lib/commandExecutor.js');

const mockedExecuteCommand = executeCommand as jest.MockedFunction<typeof executeCommand>;

describe('configSet tool', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedExecuteCommand.mockResolvedValue({
      content: [{ type: 'text' as const, text: 'Configuration set successfully' }],
    });
  });

  describe('definition', () => {
    it('should have correct tool definition', () => {
      expect(configSetTool.definition.name).toBe('configSet');
      expect(configSetTool.definition.title).toBe('Configset');
      expect(configSetTool.definition.description).toBe('Set a configuration value in backlog.md');
      expect(configSetTool.definition.inputSchema).toBeDefined();
    });

    it('should have required fields in schema', () => {
      const schema = configSetTool.definition.inputSchema;
      expect(schema.key).toBeDefined();
      expect(schema.value).toBeDefined();
      expect(schema.projectPath).toBeDefined();
    });
  });

  describe('execute', () => {
    const baseParams = {
      key: 'project.name',
      value: 'test-project',
      projectPath: '/test/project',
    };

    it('should execute config set command with key and value', async () => {
      await configSetTool.execute(baseParams);

      expect(mockedExecuteCommand).toHaveBeenCalledWith({
        command: 'npx backlog config set project.name test-project',
        successMessage: 'Configuration set successfully',
        projectPath: '/test/project',
      });
    });

    it('should handle different key-value pairs', async () => {
      const testCases = [
        { key: 'project.version', value: '2.0.0' },
        { key: 'team.lead', value: 'john.doe' },
        { key: 'settings.debug', value: 'true' },
        { key: 'app.port', value: '3000' },
      ];

      for (const testCase of testCases) {
        jest.clearAllMocks();
        const params = { ...testCase, projectPath: '/test/project' };

        await configSetTool.execute(params);

        expect(mockedExecuteCommand).toHaveBeenCalledWith({
          command: `npx backlog config set ${testCase.key} ${testCase.value}`,
          successMessage: 'Configuration set successfully',
          projectPath: '/test/project',
        });
      }
    });

    it('should handle values with spaces', async () => {
      const params = {
        key: 'project.description',
        value: 'A test project with spaces',
        projectPath: '/test/project',
      };

      await configSetTool.execute(params);

      expect(mockedExecuteCommand).toHaveBeenCalledWith({
        command: 'npx backlog config set project.description A test project with spaces',
        successMessage: 'Configuration set successfully',
        projectPath: '/test/project',
      });
    });

    it('should handle special characters in values', async () => {
      const params = {
        key: 'api.url',
        value: 'https://api.example.com/v1?auth=token&format=json',
        projectPath: '/test/project',
      };

      await configSetTool.execute(params);

      expect(mockedExecuteCommand).toHaveBeenCalledWith({
        command: 'npx backlog config set api.url https://api.example.com/v1?auth=token&format=json',
        successMessage: 'Configuration set successfully',
        projectPath: '/test/project',
      });
    });

    it('should handle command execution errors', async () => {
      const error = new Error('Invalid configuration key');
      mockedExecuteCommand.mockRejectedValueOnce(error);

      await expect(configSetTool.execute(baseParams)).rejects.toThrow('Invalid configuration key');
    });

    it('should log execution details', async () => {
      const consoleInfoSpy = jest.spyOn(console, 'info').mockImplementation();

      await configSetTool.execute(baseParams);

      expect(consoleInfoSpy).toHaveBeenCalledWith('Setting configuration', baseParams);

      consoleInfoSpy.mockRestore();
    });

    it('should return result from executeCommand', async () => {
      const mockResult = {
        content: [{ type: 'text' as const, text: 'Configuration updated' }],
      };
      mockedExecuteCommand.mockResolvedValueOnce(mockResult);

      const result = await configSetTool.execute(baseParams);

      expect(result).toBe(mockResult);
    });
  });

  describe('edge cases', () => {
    it('should handle empty values', async () => {
      const params = {
        key: 'temp.setting',
        value: '',
        projectPath: '/test/project',
      };

      await configSetTool.execute(params);

      expect(mockedExecuteCommand).toHaveBeenCalledWith({
        command: 'npx backlog config set temp.setting ',
        successMessage: 'Configuration set successfully',
        projectPath: '/test/project',
      });
    });

    it('should handle numeric values as strings', async () => {
      const params = {
        key: 'app.port',
        value: '3000',
        projectPath: '/test/project',
      };

      await configSetTool.execute(params);

      expect(mockedExecuteCommand).toHaveBeenCalledWith({
        command: 'npx backlog config set app.port 3000',
        successMessage: 'Configuration set successfully',
        projectPath: '/test/project',
      });
    });

    it('should handle boolean values as strings', async () => {
      const params = {
        key: 'debug.enabled',
        value: 'false',
        projectPath: '/test/project',
      };

      await configSetTool.execute(params);

      expect(mockedExecuteCommand).toHaveBeenCalledWith({
        command: 'npx backlog config set debug.enabled false',
        successMessage: 'Configuration set successfully',
        projectPath: '/test/project',
      });
    });
  });
});
