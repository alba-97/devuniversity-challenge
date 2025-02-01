module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["@testing-library/jest-dom/extend-expect"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "next/router": "next/router",
    "next/navigation": "next/navigation",
  },
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  testMatch: [
    "**/__tests__/**/*.test.[jt]s?(x)",
    "**/__tests__/integration/**/*.test.[jt]s?(x)",
  ],
  modulePaths: ["<rootDir>/src"],
  globals: {
    "ts-jest": {
      tsconfig: "tsconfig.jest.json",
    },
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
};
