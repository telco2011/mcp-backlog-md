import { executeCommand } from '../lib/commandExecutor';
import updateAgentInstructions from './updateAgentInstructions';

jest.mock('../lib/commandExecutor');

describe('updateAgentInstructions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call the executeCommand with the correct arguments', async () => {
    await updateAgentInstructions.execute();

    expect(executeCommand).toHaveBeenCalledWith(
      'backlog update-agent-instructions',
      'Agent instructions updated successfully'
    );
  });
});
