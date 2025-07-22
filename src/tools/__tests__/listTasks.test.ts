import { executeCommand } from '../../lib/commandExecutor';
import listTasks from '../listTasks';

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

  it('should call the executeCommand with no arguments', async () => {
    const args = {};

    await listTasks.execute(args);

    expect(executeCommand).toHaveBeenCalledWith('backlog task list', 'Tasks listed successfully');
  });

  it('should call the executeCommand with only status', async () => {
    const args = {
      status: 'in-progress',
    };

    await listTasks.execute(args);

    expect(executeCommand).toHaveBeenCalledWith('backlog task list --status "in-progress"', 'Tasks listed successfully');
  });

  it('should call the executeCommand with only assignee', async () => {
    const args = {
      assignee: 'Test Assignee',
    };

    await listTasks.execute(args);

    expect(executeCommand).toHaveBeenCalledWith('backlog task list --assignee "Test Assignee"', 'Tasks listed successfully');
  });

  it('should call the executeCommand with only parent', async () => {
    const args = {
      parent: '123',
    };

    await listTasks.execute(args);

    expect(executeCommand).toHaveBeenCalledWith('backlog task list --parent "123"', 'Tasks listed successfully');
  });
});
