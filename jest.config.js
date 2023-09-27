module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: [
    '.*/fixtures.ts',
    '.*/*.fixtures.ts',
    '.*/dist/.*',
    '.*dist.*',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: -10,
    },
  },
  modulePathIgnorePatterns: ['<rootDir>/dist/'],
  transform: {
    '\\.[jt]sx?$': ['ts-jest', { tsconfig: 'tsconfig.jest.json' }],
  },
};
