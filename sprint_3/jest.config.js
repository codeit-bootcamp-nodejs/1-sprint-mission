const { createDefaultPreset } = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  collectCoverage: true,
  coverageDirectory: "coverage",
  moduleFileExtensions: ["ts", "js", "json", "node"],
  testMatch: ["**/tests/**/*.test.ts"],
  transform: {
    "^.+\\.ts$": "ts-jest",
  },
  collectCoverageFrom: [
    "src/controllers/articleController.ts",
    "src/controllers/productController.ts",
    "src/controllers/userController.ts",
    "src/services/articleService.ts",
    "src/services/productService.ts",
    "src/services/userService.ts",
    "src/repositories/articleRepository.ts",
    "src/repositories/productRepository.ts",
    "src/repositories/userRepository.ts",
  ],
};
