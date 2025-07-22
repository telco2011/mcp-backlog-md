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

    expect(executeCommand).toHaveBeenCalledWith('backlog doc create "Test Doc" --path "/test/path" --type "test-type"', 'Document created successfully');
  });

  it('should call the executeCommand with only the title', async () => {
    const args = {
      title: 'Test Doc',
    };

    await createDoc.execute(args);

    expect(executeCommand).toHaveBeenCalledWith('backlog doc create "Test Doc"', 'Document created successfully');
  });

  it('should call the executeCommand with title and path', async () => {
    const args = {
      title: 'Test Doc',
      path: '/test/path',
    };

    await createDoc.execute(args);

    expect(executeCommand).toHaveBeenCalledWith('backlog doc create "Test Doc" --path "/test/path"', 'Document created successfully');
  });

  it('should call the executeCommand with title and type', async () => {
    const args = {
      title: 'Test Doc',
      type: 'test-type',
    };

    await createDoc.execute(args);

    expect(executeCommand).toHaveBeenCalledWith('backlog doc create "Test Doc" --type "test-type"', 'Document created successfully');
  });
});
