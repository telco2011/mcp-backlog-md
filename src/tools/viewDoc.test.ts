import { executeCommand } from '../lib/commandExecutor';
import viewDoc from './viewDoc';

jest.mock('../lib/commandExecutor');

describe('viewDoc', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call the executeCommand with the correct arguments', async () => {
    const args = {
      id: '123',
    };

    await viewDoc.execute(args);

    expect(executeCommand).toHaveBeenCalledWith(
      'backlog doc view 123',
      'Document viewed successfully'
    );
  });
});
