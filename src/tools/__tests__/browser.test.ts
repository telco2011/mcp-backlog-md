/**
 * Unit tests for browser tool
 *
 * Tests the MCP tool that launches the web UI for backlog.md
 */
import { executeCommand } from '../../lib/commandExecutor.js';
import browserTool from '../browser.js';

// Mock the command executor
jest.mock('../../lib/commandExecutor.js');

const mockedExecuteCommand = executeCommand as jest.MockedFunction<typeof executeCommand>;

describe('browser tool', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedExecuteCommand.mockResolvedValue({
      content: [{ type: 'text' as const, text: 'Web UI started at http://localhost:3000' }],
    });
  });

  describe('definition', () => {
    it('should have correct tool definition', () => {
      expect(browserTool.definition.name).toBe('browser');
      expect(browserTool.definition.title).toBe('Browser');
      expect(browserTool.definition.description).toBe('Launch the web UI for backlog.md');
      expect(browserTool.definition.inputSchema).toBeDefined();
    });

    it('should have expected fields in schema', () => {
      const schema = browserTool.definition.inputSchema;
      expect(schema.port).toBeDefined();
      expect(schema.noOpen).toBeDefined();
      expect(schema.projectPath).toBeDefined();
    });
  });

  describe('execute', () => {
    const baseParams = {
      projectPath: '/test/project',
      noOpen: true,
    };

    it('should execute browser command with default options', async () => {
      await browserTool.execute(baseParams);

      expect(mockedExecuteCommand).toHaveBeenCalledWith({
        command: 'npx backlog browser --no-open',
        successMessage: 'Browser launched successfully',
        projectPath: '/test/project',
      });
    });

    it('should include port when provided', async () => {
      const params = { ...baseParams, port: 8080 };
      await browserTool.execute(params);

      expect(mockedExecuteCommand).toHaveBeenCalledWith({
        command: 'npx backlog browser --port 8080 --no-open',
        successMessage: 'Browser launched successfully',
        projectPath: '/test/project',
      });
    });

    it('should include --no-open flag by default', async () => {
      await browserTool.execute(baseParams);

      expect(mockedExecuteCommand).toHaveBeenCalledWith(
        expect.objectContaining({
          command: expect.stringContaining('--no-open'),
        })
      );
    });

    it('should include --no-open when explicitly set to true', async () => {
      const params = { ...baseParams, noOpen: true };
      await browserTool.execute(params);

      expect(mockedExecuteCommand).toHaveBeenCalledWith({
        command: 'npx backlog browser --no-open',
        successMessage: 'Browser launched successfully',
        projectPath: '/test/project',
      });
    });

    it('should not include --no-open when set to false', async () => {
      const params = { ...baseParams, noOpen: false };
      await browserTool.execute(params);

      expect(mockedExecuteCommand).toHaveBeenCalledWith({
        command: 'npx backlog browser',
        successMessage: 'Browser launched successfully',
        projectPath: '/test/project',
      });
    });

    it('should handle both port and noOpen parameters', async () => {
      const params = { ...baseParams, port: 3001, noOpen: false };
      await browserTool.execute(params);

      expect(mockedExecuteCommand).toHaveBeenCalledWith({
        command: 'npx backlog browser --port 3001',
        successMessage: 'Browser launched successfully',
        projectPath: '/test/project',
      });
    });

    it('should handle different port numbers', async () => {
      const testPorts = [3000, 8080, 4200, 5173, 8000];

      for (const port of testPorts) {
        jest.clearAllMocks();
        const params = { ...baseParams, port };

        await browserTool.execute(params);

        expect(mockedExecuteCommand).toHaveBeenCalledWith({
          command: `npx backlog browser --port ${port} --no-open`,
          successMessage: 'Browser launched successfully',
          projectPath: '/test/project',
        });
      }
    });

    it('should handle command execution errors', async () => {
      const error = new Error('Port already in use');
      mockedExecuteCommand.mockRejectedValueOnce(error);

      await expect(browserTool.execute(baseParams)).rejects.toThrow('Port already in use');
    });

    it('should log execution details', async () => {
      const consoleInfoSpy = jest.spyOn(console, 'info').mockImplementation();

      await browserTool.execute(baseParams);

      expect(consoleInfoSpy).toHaveBeenCalledWith('Launching browser', baseParams);

      consoleInfoSpy.mockRestore();
    });

    it('should return result from executeCommand', async () => {
      const mockResult = {
        content: [{ type: 'text' as const, text: 'Browser launched on port 3000' }],
      };
      mockedExecuteCommand.mockResolvedValueOnce(mockResult);

      const result = await browserTool.execute(baseParams);

      expect(result).toBe(mockResult);
    });
  });

  describe('parameter combinations', () => {
    const baseParams = { projectPath: '/test/project', noOpen: true };

    it('should handle all parameters together', async () => {
      const params = {
        ...baseParams,
        port: 9000,
        noOpen: true,
      };

      await browserTool.execute(params);

      expect(mockedExecuteCommand).toHaveBeenCalledWith({
        command: 'npx backlog browser --port 9000 --no-open',
        successMessage: 'Browser launched successfully',
        projectPath: '/test/project',
      });
    });

    it('should handle port without noOpen flag', async () => {
      const params = {
        ...baseParams,
        port: 4000,
        noOpen: false,
      };

      await browserTool.execute(params);

      expect(mockedExecuteCommand).toHaveBeenCalledWith({
        command: 'npx backlog browser --port 4000',
        successMessage: 'Browser launched successfully',
        projectPath: '/test/project',
      });
    });
  });

  describe('edge cases', () => {
    it('should handle very high port numbers', async () => {
      const params = { projectPath: '/test/project', port: 65535, noOpen: true };

      await browserTool.execute(params);

      expect(mockedExecuteCommand).toHaveBeenCalledWith({
        command: 'npx backlog browser --port 65535 --no-open',
        successMessage: 'Browser launched successfully',
        projectPath: '/test/project',
      });
    });

    it('should handle low port numbers', async () => {
      const params = { projectPath: '/test/project', port: 1024, noOpen: true };

      await browserTool.execute(params);

      expect(mockedExecuteCommand).toHaveBeenCalledWith({
        command: 'npx backlog browser --port 1024 --no-open',
        successMessage: 'Browser launched successfully',
        projectPath: '/test/project',
      });
    });
  });
});
