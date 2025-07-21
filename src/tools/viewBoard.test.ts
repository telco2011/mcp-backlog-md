import { executeCommand } from '../lib/commandExecutor';
import viewBoard from './viewBoard';

jest.mock('../lib/commandExecutor');

describe('viewBoard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call the executeCommand with the correct arguments', async () => {
    await viewBoard.execute();

    expect(executeCommand).toHaveBeenCalledWith(
      'backlog view board',
      'Board viewed successfully'
    );
  });
});
