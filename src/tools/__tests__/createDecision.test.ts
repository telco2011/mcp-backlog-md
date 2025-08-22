/**
 * Unit tests for createDecision tool
 */
import { executeCommand } from '../../lib/commandExecutor.js';
import createDecisionTool from '../createDecision.js';

// Mock the command executor
jest.mock('../../lib/commandExecutor.js');

const mockedExecuteCommand = executeCommand as jest.MockedFunction<typeof executeCommand>;

describe('createDecision tool', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedExecuteCommand.mockResolvedValue({
      content: [{ type: 'text' as const, text: 'Decision created successfully' }],
    });
  });

  describe('definition', () => {
    it('should have correct tool definition', () => {
      expect(createDecisionTool.definition.name).toBe('createDecision');
      expect(createDecisionTool.definition.title).toBe('Createdecision');
      expect(createDecisionTool.definition.description).toBe('Create a new decision in backlog.md');
    });
  });

  describe('execute', () => {
    const baseParams = {
      title: 'Test Decision',
      projectPath: '/test/project',
    };

    it('should execute with required parameters', async () => {
      await createDecisionTool.execute(baseParams);

      expect(mockedExecuteCommand).toHaveBeenCalledWith({
        command: 'npx backlog decision create "Test Decision"',
        successMessage: 'Decision created successfully',
        projectPath: '/test/project',
      });
    });

    it('should handle optional status parameter', async () => {
      const params = { ...baseParams, status: 'approved' };
      await createDecisionTool.execute(params);

      expect(mockedExecuteCommand).toHaveBeenCalledWith({
        command: 'npx backlog decision create "Test Decision" --status "approved"',
        successMessage: 'Decision created successfully',
        projectPath: '/test/project',
      });
    });
  });
});
