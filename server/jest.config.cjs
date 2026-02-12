module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ['<rootDir>'],
    testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
    transform: {
      '^.+\\.ts$': 'ts-jest',
    },
    moduleNameMapper: {
      '^(\\.{1,2}/.*)\\.js$': '$1',
    },
    testPathIgnorePatterns: ['/node_modules/', '/dist/'],
    collectCoverageFrom: [
      '**/*.ts',
      '!**/*.d.ts',
      '!**/node_modules/**',
      '!**/dist/**',
    ],
  };

  // module.exports = {
  //   preset: 'ts-jest/presets/default-esm',
  //   testEnvironment: 'node',
  
  //   extensionsToTreatAsEsm: ['.ts'],
  
  //   transform: {
  //     '^.+\\.ts$': [
  //       'ts-jest',
  //       { useESM: true },
  //     ],
  //   },
  
  //   moduleNameMapper: {
  //     '^(\\.{1,2}/.*)\\.js$': '$1',
  //   },
  
  //   testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  // };