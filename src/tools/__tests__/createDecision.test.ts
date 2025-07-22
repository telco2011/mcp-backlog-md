import createDecision from '../createDecision';
import { executeCommand } from '../../lib/commandExecutor';

jest.mock('../lib/commandExecutor');

describe('createDecision', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call the executeCommand with the correct arguments', async () => {
    const args = {
      title: 'Test Decision',
      status: 'accepted',
    };

    await createDecision.execute(args);

    expect(executeCommand).toHaveBeenCalledWith('backlog decision create "Test Decision" --status "accepted"', 'Decision created successfully');
  });

  it('should call the executeCommand with only the title', async () => {
    const args = {
      title: 'Test Decision',
    };

    await createDecision.execute(args);

    expect(executeCommand).toHaveBeenCalledWith('backlog decision create "Test Decision"', 'Decision created successfully');
  });
});
