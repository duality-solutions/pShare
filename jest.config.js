module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  "testPathIgnorePatterns": [
    "/node_modules/",
    "/e2e/",
    "/src/sjcl"
  ],
};