/**
 * Mock implementation of commandExecutor for testing purposes.
 * This mock allows tests to run without executing actual CLI commands.
 */
import { CallToolResult } from '@modelcontextprotocol/sdk/types.js';

interface ExecuteCommandOptions {
  command: string;
  successMessage: string;
  projectPath: string;
  retries?: number;
  retryDelay?: number;
}

// Mock data for different commands
const mockResponses: Record<string, string> = {
  'npx backlog task create': 'Task created successfully with ID: test-1',
  'npx backlog task list': 'task-1: Test Task\ntask-2: Another Task',
  'npx backlog task view': 'ID: test-1\nTitle: Test Task\nStatus: To Do',
  'npx backlog config list': 'project.name=test-project\nproject.version=1.0.0',
  'npx backlog cleanup': 'Cleanup completed. 0 tasks moved to archive.',
  'npx backlog browser': 'Web UI started at http://localhost:3000',
};

// Mock implementation that can be controlled by tests
export const executeCommand = jest.fn(async (options: ExecuteCommandOptions): Promise<CallToolResult> => {
  // Simulate project path validation
  if (!options.projectPath) {
    throw new Error('Project path was not provided.');
  }

  if (options.projectPath === '/invalid/path') {
    throw new Error('Backlog.md has not been initialized.');
  }

  // Find matching response
  let response = 'Mock command executed successfully';
  for (const [key, value] of Object.entries(mockResponses)) {
    if (options.command.includes(key)) {
      response = value;
      break;
    }
  }

  return {
    content: [
      {
        type: 'text' as const,
        text: response,
        _meta: { successMessage: options.successMessage },
      },
    ],
  };
});

// Helper functions for tests to control mock behavior
export const mockExecuteCommandSuccess = (response: string) => {
  executeCommand.mockResolvedValueOnce({
    content: [{ type: 'text' as const, text: response }],
  });
};

export const mockExecuteCommandError = (error: Error) => {
  executeCommand.mockRejectedValueOnce(error);
};

export const clearExecuteCommandMock = () => {
  executeCommand.mockClear();
};
