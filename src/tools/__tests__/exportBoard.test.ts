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

    expect(executeCommand).toHaveBeenCalledWith(
      'backlog export board --file test.md --force',
      'Board exported successfully'
    );
  });
});
