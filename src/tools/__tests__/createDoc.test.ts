import createDoc from '../createDoc';
import { executeCommand } from '../../lib/commandExecutor';

jest.mock('../lib/commandExecutor');

describe('createDoc', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call the executeCommand with the correct arguments', async () => {
    const args = {
      title: 'Test Doc',
      path: '/test/path',
      type: 'test-type',
    };

    await createDoc.execute(args);

    expect(executeCommand).toHaveBeenCalledWith(
      'backlog doc create "Test Doc" --path "/test/path" --type "test-type"',
      'Document created successfully'
    );
  });
});
