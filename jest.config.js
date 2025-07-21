export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/?(*.)+(spec|test).[jt]s?(x)'],
  moduleNameMapper: {
    '^../lib/commandExecutor$': '<rootDir>/src/lib/__mocks__/commandExecutor.ts',
    '^../lib/zodSchemas$': '<rootDir>/src/lib/zodSchemas.ts',
    '^@modelcontextprotocol/sdk/(.*).js$': '<rootDir>/node_modules/@modelcontextprotocol/sdk/$1.js'
  },
};
