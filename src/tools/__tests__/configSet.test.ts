import configSet from '../configSet';
import { executeCommand } from '../../lib/commandExecutor';

jest.mock('../lib/commandExecutor');

describe('configSet', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call the executeCommand with the correct arguments', async () => {
    const args = {
      key: 'testKey',
      value: 'testValue',
    };

    await configSet.execute(args);

    expect(executeCommand).toHaveBeenCalledWith('backlog config set testKey testValue', 'Configuration set successfully');
  });
});
