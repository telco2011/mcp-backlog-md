import archiveTask from './archiveTask';
import { executeCommand } from '../lib/commandExecutor';

jest.mock('../lib/commandExecutor');

describe('archiveTask', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call the executeCommand with the correct arguments', async () => {
    const args = {
      id: '123',
    };

    await archiveTask.execute(args);

    expect(executeCommand).toHaveBeenCalledWith(
      'backlog task archive 123',
      'Task archived successfully'
    );
  });
});
