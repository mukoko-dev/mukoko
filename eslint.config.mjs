import baseConfig from "@mukoko/eslint-config/base";

export default [
  ...baseConfig,
  {
    ignores: [
      "**/node_modules/**",
      "**/dist/**",
      "**/.next/**",
      "**/out/**",
      "web/studio/**",
      ".turbo/**",
      ".husky/**",
    ],
  },
];
