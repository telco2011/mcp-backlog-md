import { executeCommand } from '../../lib/commandExecutor';
import promoteDraft from '../promoteDraft';

jest.mock('../lib/commandExecutor');

describe('promoteDraft', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call the executeCommand with the correct arguments', async () => {
    const args = {
      id: '123',
    };

    await promoteDraft.execute(args);

    expect(executeCommand).toHaveBeenCalledWith(
      'backlog draft promote 123',
      'Draft promoted successfully'
    );
  });
});
