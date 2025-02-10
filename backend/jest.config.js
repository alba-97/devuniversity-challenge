/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  testMatch: ["<rootDir>/src/**/*.test.ts", "<rootDir>/src/**/*.test.tsx"],
  transformIgnorePatterns: ["node_modules/(?!(@your-project-scope)/)"],
  roots: ["<rootDir>/src"],
  maxWorkers: 2,
  forceExit: true,
  testTimeout: 30000,
  detectOpenHandles: true,
};
