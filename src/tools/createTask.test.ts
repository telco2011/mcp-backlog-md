import createTask from './createTask';
import { executeCommand } from '../lib/commandExecutor';

jest.mock('../lib/commandExecutor');

describe('createTask', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call the executeCommand with the correct arguments', async () => {
    const args = {
      title: 'Test Task',
      description: 'Test Description',
      assignee: 'Test Assignee',
      status: 'Test Status',
      labels: 'Test,Label',
      priority: 'High',
      plan: 'Test Plan',
      ac: 'Test AC',
      notes: 'Test Notes',
      dep: 'Test Dep',
      parent: 'Test Parent',
      draft: true,
    };

    await createTask.execute(args);

    expect(executeCommand).toHaveBeenCalledWith(
      'backlog task create "Test Task" --description "Test Description" --assignee "Test Assignee" --status "Test Status" --labels Test,Label --priority High --plan "Test Plan" --ac "Test AC" --notes "Test Notes" --dep Test Dep --parent Test Parent --draft',
      'Task created successfully'
    );
  });
});
