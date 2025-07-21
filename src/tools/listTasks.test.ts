import { executeCommand } from '../lib/commandExecutor';
import listTasks from './listTasks';

jest.mock('../lib/commandExecutor');

describe('listTasks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call the executeCommand with the correct arguments', async () => {
    const args = {
      status: 'in-progress',
      assignee: 'Test Assignee',
      parent: '123',
    };

    await listTasks.execute(args);

    expect(executeCommand).toHaveBeenCalledWith(
      'backlog task list --status "in-progress" --assignee "Test Assignee" --parent "123"',
      'Tasks listed successfully'
    );
  });
});
