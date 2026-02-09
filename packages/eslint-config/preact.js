import baseConfig from "./base.js";

/** @type {import("eslint").Linter.Config[]} */
export default [
  ...baseConfig,
  {
    files: ["**/*.tsx", "**/*.jsx"],
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        jsxPragma: null,
      },
    },
    rules: {
      // Preact uses class instead of className
      "react/no-unknown-property": "off",
      // Preact components can return undefined
      "consistent-return": "off",
    },
    settings: {
      react: {
        pragma: "h",
        pragmaFrag: "Fragment",
        version: "18",
      },
    },
  },
  {
    files: ["**/*.ts", "**/*.tsx"],
    rules: {
      // Allow Preact's JSX types
      "@typescript-eslint/no-namespace": "off",
    },
  },
];
