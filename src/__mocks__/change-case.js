/**
 * Mock implementation of change-case for testing
 */

const capitalCase = jest.fn((str) => {
  return str
    .split(/[\s_-]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
});

const snakeCase = jest.fn((str) => {
  return str
    .replace(/([A-Z])/g, '_$1')
    .toLowerCase()
    .replace(/^_/, '')
    .replace(/[\s-]+/g, '_');
});

const camelCase = jest.fn((str) => {
  const words = str.split(/[\s_-]+/);
  return (
    words[0].toLowerCase() +
    words
      .slice(1)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join('')
  );
});

const paramCase = jest.fn((str) => {
  return str
    .replace(/([A-Z])/g, '-$1')
    .toLowerCase()
    .replace(/^-/, '')
    .replace(/[\s_]+/g, '-');
});

module.exports = {
  capitalCase,
  snakeCase,
  camelCase,
  paramCase,
  __esModule: true,
  default: {
    capitalCase,
    snakeCase,
    camelCase,
    paramCase,
  },
};
