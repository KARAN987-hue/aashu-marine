export default {
  testEnvironment: 'node',
  transform: {},
  testMatch: ['**/__tests__/**/*.test.js', '**/?(*.)+(spec|test).js'],
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/database/**',
    '!src/other/**'
  ],
  moduleFileExtensions: ['js', 'json'],
  verbose: true
};
