import demoteTask from '../demoteTask';
import { executeCommand } from '../../lib/commandExecutor';

jest.mock('../lib/commandExecutor');

describe('demoteTask', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call the executeCommand with the correct arguments', async () => {
    const args = {
      id: '123',
    };

    await demoteTask.execute(args);

    expect(executeCommand).toHaveBeenCalledWith('backlog task demote 123', 'Task demoted successfully');
  });
});
