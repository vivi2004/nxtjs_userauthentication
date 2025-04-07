// eslint.config.mjs
import next from "@next/eslint-plugin-next";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import js from "@eslint/js";

export default [
  js.configs.recommended,
  {
    plugins: {
      "@next/next": next,
      "@typescript-eslint": typescriptEslint,
    },
    rules: {
      ...next.configs.recommended.rules,
      ...next.configs["core-web-vitals"].rules,
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-explicit-any": "error",
    },
    languageOptions: {
      parserOptions: {
        sourceType: "module",
        ecmaVersion: "latest",
        project: "./tsconfig.json",
      },
    },
    settings: {
      next: {
        rootDir: ".",
      },
    },
  },
];
