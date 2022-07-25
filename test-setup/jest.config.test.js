module.exports = {
  rootDir: '../',
  testEnvironment: 'node',
  testRegex: 'src/.*.spec.ts$',
  preset: 'ts-jest',
  setupFilesAfterEnv: ['<rootDir>/test-setup/jest.setup.js'],
};
