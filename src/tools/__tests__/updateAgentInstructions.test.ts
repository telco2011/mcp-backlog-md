/**
 * Unit tests for updateAgentInstructions tool
 */
import { executeCommand } from '../../lib/commandExecutor.js';
import updateAgentInstructionsTool from '../updateAgentInstructions.js';

// Mock the command executor
jest.mock('../../lib/commandExecutor.js');

const mockedExecuteCommand = executeCommand as jest.MockedFunction<typeof executeCommand>;

describe('updateAgentInstructions tool', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedExecuteCommand.mockResolvedValue({
      content: [{ type: 'text' as const, text: 'Agent instructions updated successfully' }],
    });
  });

  describe('definition', () => {
    it('should have correct tool definition', () => {
      expect(updateAgentInstructionsTool.definition.name).toBe('updateAgentInstructions');
      expect(updateAgentInstructionsTool.definition.title).toBe('Updateagentinstructions');
      expect(updateAgentInstructionsTool.definition.description).toBe('Update agent instruction files in backlog.md');
    });
  });

  describe('execute', () => {
    const baseParams = { projectPath: '/test/project' };

    it('should execute with minimal parameters', async () => {
      await updateAgentInstructionsTool.execute(baseParams);

      expect(mockedExecuteCommand).toHaveBeenCalledWith({
        command: 'npx backlog update-agent-instructions',
        successMessage: 'Agent instructions updated successfully',
        projectPath: '/test/project',
      });
    });
  });
});
