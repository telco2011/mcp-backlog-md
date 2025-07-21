import configList from './configList';
import { executeCommand } from '../lib/commandExecutor';

jest.mock('../lib/commandExecutor');

describe('configList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call the executeCommand with the correct arguments', async () => {
    await configList.execute();

    expect(executeCommand).toHaveBeenCalledWith(
      'backlog config list',
      'Configuration listed successfully'
    );
  });
});
