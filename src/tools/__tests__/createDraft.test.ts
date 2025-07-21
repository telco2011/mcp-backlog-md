import createDraft from '../createDraft';
import { executeCommand } from '../../lib/commandExecutor';

jest.mock('../lib/commandExecutor');

describe('createDraft', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call the executeCommand with the correct arguments', async () => {
    const args = {
      title: 'Test Draft',
    };

    await createDraft.execute(args);

    expect(executeCommand).toHaveBeenCalledWith(
      'backlog draft create "Test Draft"',
      'Draft created successfully'
    );
  });
});
