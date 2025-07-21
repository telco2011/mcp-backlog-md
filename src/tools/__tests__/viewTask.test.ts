import { executeCommand } from '../../lib/commandExecutor';
import viewTask from '../viewTask';

jest.mock('../lib/commandExecutor');

describe('viewTask', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call the executeCommand with the correct arguments', async () => {
    const args = {
      id: '123',
      plain: true,
    };

    await viewTask.execute(args);

    expect(executeCommand).toHaveBeenCalledWith(
      'backlog task view 123 --plain',
      'Task viewed successfully'
    );
  });
});
