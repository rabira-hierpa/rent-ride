module.exports = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],
  moduleNameMapper: {
    // Handle CSS imports (with CSS modules)
    // Handle CSS imports (without CSS modules)
    "^.+\\.(css|less|scss|sass)$": "identity-obj-proxy",
    // Handle static assets
    "^.+\\.(jpg|jpeg|png|gif|webp|svg|ttf|woff|woff2)$":
      "<rootDir>/src/__mocks__/fileMock.js",
    // Handle module path aliases
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  transformIgnorePatterns: [
    "/node_modules/(?!antd|@ant-design|@arcgis/core|@babel/runtime)/",
  ],
  // Use our custom transformer to handle import.meta.env
  transform: {
    "^.+\\.[tj]sx?$": "<rootDir>/importMetaTransformer.cjs",
  },
  // Set environment variables for tests (they'll be available via process.env after transformation)
  testEnvironmentOptions: {
    customExportConditions: ["node", "node-addons"],
  },
};
