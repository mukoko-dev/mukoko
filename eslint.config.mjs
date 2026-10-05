import baseConfig from "@mukoko/eslint-config/base";

export default [
  ...baseConfig,
  {
    ignores: [
      "**/node_modules/**",
      "**/dist/**",
      "**/.next/**",
      "**/out/**",
      ".turbo/**",
      ".husky/**",
    ],
  },
];
