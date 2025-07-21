import cleanup from './cleanup';
import { executeCommand } from '../lib/commandExecutor';

jest.mock('../lib/commandExecutor');

describe('cleanup', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call the executeCommand with the correct arguments', async () => {
    await cleanup.execute();

    expect(executeCommand).toHaveBeenCalledWith(
      'backlog cleanup',
      'Cleanup successful'
    );
  });
});
