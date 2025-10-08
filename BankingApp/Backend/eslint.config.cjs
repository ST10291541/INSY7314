const js = require("@eslint/js");
const globals = require("globals");

module.exports = [
  // Ignore unnecessary folders
  { ignores: ["node_modules/", "coverage/", "dist/", "build/", ".circleci/", "ssl/"] },

  // Recommended ESLint rules
  js.configs.recommended,

  // General JS files
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: "commonjs",
      globals: { ...globals.node, ...globals.es2021 },
    },
    rules: {
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    },
  },

  // Test files
  {
    files: ["src/test/**/*.test.js", "**/__tests__/**/*.js"],
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: "commonjs",
      // Define Jest globals here instead of env
      globals: { ...globals.jest, ...globals.node, ...globals.es2021 },
    },
    rules: {
      // Optional: test-specific rules
    },
  },
];
