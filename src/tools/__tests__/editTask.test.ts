import editTask from '../editTask';
import { executeCommand } from '../../lib/commandExecutor';

jest.mock('../lib/commandExecutor');

describe('editTask', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call the executeCommand with the correct arguments', async () => {
    const args = {
      id: '123',
      assignee: 'Test Assignee',
      labels: 'Test,Label',
      plan: 'Test Plan',
      ac: 'Test AC',
      notes: 'Test Notes',
      dep: 'Test Dep',
    };

    await editTask.execute(args);

    expect(executeCommand).toHaveBeenCalledWith(
      'backlog task edit 123 --assignee "Test Assignee" --labels Test,Label --plan "Test Plan" --ac "Test AC" --notes "Test Notes" --dep Test Dep',
      'Task edited successfully'
    );
  });

  it('should call the executeCommand with only the id', async () => {
    const args = {
      id: '123',
    };

    await editTask.execute(args);

    expect(executeCommand).toHaveBeenCalledWith('backlog task edit 123', 'Task edited successfully');
  });
});
