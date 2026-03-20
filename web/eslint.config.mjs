import nextjsConfig from "@mukoko/eslint-config/nextjs";

/** @type {import("eslint").Linter.Config[]} */
export default [
  ...nextjsConfig,
  {
    ignores: [".next/**", "out/**", "dist/**", "node_modules/**", "studio/**", "next-env.d.ts"],
  },
];
