import browser from '../browser';
import { executeCommand } from '../../lib/commandExecutor';

jest.mock('../lib/commandExecutor');

describe('browser', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call the executeCommand with the correct arguments', async () => {
    const args = {
      port: 8080,
      noOpen: true,
    };

    await browser.execute(args);

    expect(executeCommand).toHaveBeenCalledWith(
      'backlog browser --port 8080 --no-open',
      'Browser launched successfully'
    );
  });
});
