import { executeCommand } from '../../lib/commandExecutor';
import exportBoard from '../exportBoard';

jest.mock('../lib/commandExecutor');

describe('exportBoard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call the executeCommand with the correct arguments', async () => {
    const args = {
      file: 'test.md',
      force: true,
    };

    await exportBoard.execute(args);

    expect(executeCommand).toHaveBeenCalledWith('backlog export board --file test.md --force', 'Board exported successfully');
  });

  it('should call the executeCommand with only the file', async () => {
    const args = {
      file: 'test.md',
    };

    await exportBoard.execute(args);

    expect(executeCommand).toHaveBeenCalledWith('backlog export board --file test.md', 'Board exported successfully');
  });

  it('should call the executeCommand with only force', async () => {
    const args = {
      force: true,
    };

    await exportBoard.execute(args);

    expect(executeCommand).toHaveBeenCalledWith('backlog export board --force', 'Board exported successfully');
  });

  it('should call the executeCommand with no arguments', async () => {
    const args = {};

    await exportBoard.execute(args);

    expect(executeCommand).toHaveBeenCalledWith('backlog export board', 'Board exported successfully');
  });
});
