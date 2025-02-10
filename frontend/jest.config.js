module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["@testing-library/jest-dom/extend-expect"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "next/router": "next/router",
    "next/navigation": "next/navigation",
    "\\.(css|less|scss|sass)$": "identity-obj-proxy"
  },
  transform: {
    "^.+\\.tsx?$": ["ts-jest", {
      tsconfig: "tsconfig.jest.json",
    }],
  },
  testMatch: [
    "**/__tests__/**/*.test.[jt]s?(x)",
    "**/__tests__/integration/**/*.test.[jt]s?(x)",
  ],
  modulePaths: ["<rootDir>/src"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
};
