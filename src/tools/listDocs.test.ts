import { executeCommand } from '../lib/commandExecutor';
import listDocs from './listDocs';

jest.mock('../lib/commandExecutor');

describe('listDocs', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call the executeCommand with the correct arguments', async () => {
    await listDocs.execute();

    expect(executeCommand).toHaveBeenCalledWith(
      'backlog doc list',
      'Documents listed successfully'
    );
  });
});
