import backlogInit from '../backlogInit';
import { executeCommand } from '../../lib/commandExecutor';

jest.mock('../../lib/commandExecutor');

describe('backlogInit', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call the executeCommand with the correct arguments', async () => {
    const args = {
      projectName: 'test-project',
    };

    await backlogInit.execute(args);

    expect(executeCommand).toHaveBeenCalledWith('backlog init test-project', 'Backlog Initialization successfully.');
  });

  it('should call the executeCommand with the correct arguments when projectName is not provided', async () => {
    const args = {
      projectName: '',
    };

    await backlogInit.execute(args);

    expect(executeCommand).toHaveBeenCalledWith('backlog init', 'Backlog Initialization successfully.');
  });
});
