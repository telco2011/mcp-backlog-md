/**
 * Unit tests for custom error classes
 *
 * Tests the custom error classes used throughout the application
 */
import { CliError, SystemError } from '../errors.js';

describe('Custom Error Classes', () => {
  describe('CliError', () => {
    it('should create CliError with message', () => {
      const message = 'CLI command failed';
      const error = new CliError(message);

      expect(error.message).toBe(message);
      expect(error.name).toBe('CliError');
      expect(error instanceof CliError).toBe(true);
      expect(error instanceof Error).toBe(true);
    });

    it('should create CliError with message and options', () => {
      const message = 'CLI command failed';
      const cause = new Error('Underlying error');
      const error = new CliError(message, { cause });

      expect(error.message).toBe(message);
      expect(error.name).toBe('CliError');
      expect(error.cause).toBe(cause);
    });

    it('should preserve stack trace', () => {
      const error = new CliError('Test error');
      expect(error.stack).toBeDefined();
      expect(typeof error.stack).toBe('string');
      expect(error.stack).toContain('CliError');
    });

    it('should be serializable to JSON', () => {
      const message = 'CLI error message';
      const error = new CliError(message);

      // Create a plain object representation
      const errorObj = {
        name: error.name,
        message: error.message,
        stack: error.stack,
      };

      const serialized = JSON.stringify(errorObj);
      const parsed = JSON.parse(serialized);

      expect(parsed.name).toBe('CliError');
      expect(parsed.message).toBe(message);
    });

    it('should handle error chaining', () => {
      const rootCause = new Error('Root cause');
      const intermediateCause = new CliError('Intermediate error', { cause: rootCause });
      const finalError = new CliError('Final error', { cause: intermediateCause });

      expect(finalError.cause).toBe(intermediateCause);
      expect((finalError.cause as CliError).cause).toBe(rootCause);
    });

    it('should work with instanceof checks', () => {
      const error = new CliError('Test');

      expect(error instanceof CliError).toBe(true);
      expect(error instanceof Error).toBe(true);
      expect(error instanceof SystemError).toBe(false);
    });
  });

  describe('SystemError', () => {
    it('should create SystemError with message', () => {
      const message = 'System operation failed';
      const error = new SystemError(message);

      expect(error.message).toBe(message);
      expect(error.name).toBe('SystemError');
      expect(error instanceof SystemError).toBe(true);
      expect(error instanceof Error).toBe(true);
    });

    it('should create SystemError with message and options', () => {
      const message = 'System operation failed';
      const cause = new Error('File not found');
      const error = new SystemError(message, { cause });

      expect(error.message).toBe(message);
      expect(error.name).toBe('SystemError');
      expect(error.cause).toBe(cause);
    });

    it('should preserve stack trace', () => {
      const error = new SystemError('Test error');
      expect(error.stack).toBeDefined();
      expect(typeof error.stack).toBe('string');
      expect(error.stack).toContain('SystemError');
    });

    it('should be serializable to JSON', () => {
      const message = 'System error message';
      const error = new SystemError(message);

      // Create a plain object representation
      const errorObj = {
        name: error.name,
        message: error.message,
        stack: error.stack,
      };

      const serialized = JSON.stringify(errorObj);
      const parsed = JSON.parse(serialized);

      expect(parsed.name).toBe('SystemError');
      expect(parsed.message).toBe(message);
    });

    it('should handle error chaining', () => {
      const rootCause = new Error('Root cause');
      const intermediateCause = new SystemError('Intermediate error', { cause: rootCause });
      const finalError = new SystemError('Final error', { cause: intermediateCause });

      expect(finalError.cause).toBe(intermediateCause);
      expect((finalError.cause as SystemError).cause).toBe(rootCause);
    });

    it('should work with instanceof checks', () => {
      const error = new SystemError('Test');

      expect(error instanceof SystemError).toBe(true);
      expect(error instanceof Error).toBe(true);
      expect(error instanceof CliError).toBe(false);
    });
  });

  describe('Error differentiation', () => {
    it('should differentiate between CliError and SystemError', () => {
      const cliError = new CliError('CLI error');
      const systemError = new SystemError('System error');

      expect(cliError instanceof CliError).toBe(true);
      expect(cliError instanceof SystemError).toBe(false);

      expect(systemError instanceof SystemError).toBe(true);
      expect(systemError instanceof CliError).toBe(false);

      expect(cliError instanceof Error).toBe(true);
      expect(systemError instanceof Error).toBe(true);
    });

    it('should have different names for identification', () => {
      const cliError = new CliError('CLI error');
      const systemError = new SystemError('System error');

      expect(cliError.name).toBe('CliError');
      expect(systemError.name).toBe('SystemError');
    });
  });

  describe('Error handling patterns', () => {
    it('should work with try-catch blocks', () => {
      const throwCliError = () => {
        throw new CliError('CLI command failed');
      };

      const throwSystemError = () => {
        throw new SystemError('System operation failed');
      };

      expect(() => throwCliError()).toThrow(CliError);
      expect(() => throwCliError()).toThrow('CLI command failed');

      expect(() => throwSystemError()).toThrow(SystemError);
      expect(() => throwSystemError()).toThrow('System operation failed');
    });

    it('should work with error type checking in catch blocks', () => {
      const handleError = (error: unknown) => {
        if (error instanceof CliError) {
          return 'CLI error handled';
        } else if (error instanceof SystemError) {
          return 'System error handled';
        } else {
          return 'Unknown error handled';
        }
      };

      const cliError = new CliError('CLI error');
      const systemError = new SystemError('System error');
      const genericError = new Error('Generic error');

      expect(handleError(cliError)).toBe('CLI error handled');
      expect(handleError(systemError)).toBe('System error handled');
      expect(handleError(genericError)).toBe('Unknown error handled');
    });

    it('should preserve error properties when rethrowing', () => {
      const originalMessage = 'Original error message';
      const originalCause = new Error('Root cause');

      try {
        throw new CliError(originalMessage, { cause: originalCause });
      } catch (error) {
        expect(error).toBeInstanceOf(CliError);
        expect((error as CliError).message).toBe(originalMessage);
        expect((error as CliError).cause).toBe(originalCause);
      }
    });
  });

  describe('Edge cases', () => {
    it('should handle empty error messages', () => {
      const cliError = new CliError('');
      const systemError = new SystemError('');

      expect(cliError.message).toBe('');
      expect(systemError.message).toBe('');
      expect(cliError.name).toBe('CliError');
      expect(systemError.name).toBe('SystemError');
    });

    it('should handle undefined cause', () => {
      const error = new CliError('Test', { cause: undefined });

      expect(error.message).toBe('Test');
      expect(error.cause).toBe(undefined);
    });

    it('should handle null cause', () => {
      const error = new SystemError('Test', { cause: null as unknown as Error });

      expect(error.message).toBe('Test');
      expect(error.cause).toBe(null);
    });

    it('should handle very long error messages', () => {
      const longMessage = 'A'.repeat(10000);
      const error = new CliError(longMessage);

      expect(error.message).toBe(longMessage);
      expect(error.message.length).toBe(10000);
    });

    it('should handle special characters in error messages', () => {
      const specialMessage = 'Error with special chars: ñáéíóú 中文 🚀 \n\t"quotes"';
      const error = new SystemError(specialMessage);

      expect(error.message).toBe(specialMessage);
    });
  });
});
