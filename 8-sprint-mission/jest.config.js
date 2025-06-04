module.exports = {
  testEnvironment: "node",
  verbose: true,
  testMatch: ["**/*.test.ts", "**/*.test.js"],
  transform: {
    "^.+\\.ts$": "ts-jest",
  },
  moduleFileExtensions: ["ts", "js"],
};
