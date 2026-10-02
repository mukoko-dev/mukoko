// Vite+ configuration: the org's standard check, lint and format settings.
// See nyuchi/.github/.github/workflows/reusable-vite-plus.yml.
//
// A plain object rather than defineConfig() from "vite-plus": this repo
// does not install vite-plus (its vitest 5 changes which vitest the
// workspace's own vitest 2/3 test setups resolve), so `vp` comes from CI
// (voidzero-dev/setup-vp) or a global install (`npm i -g vite-plus`).
const config = {
  // `vp check` reads ONLY this block, not .oxfmtrc.json. These values mirror
  // nyuchi/.github/.oxfmtrc.json, which the org-required `vite-plus / fmt`
  // job uses on Markdown and JSON. Keep the two identical: two formatters
  // with different settings on one file can never both pass.
  fmt: {
    printWidth: 80,
    proseWrap: "preserve",
    tabWidth: 2,
    useTabs: false,
    endOfLine: "lf",
    trailingComma: "all",
    sortPackageJson: false,
    overrides: [
      {
        files: ["*.md", "*.mdx"],
        options: { embeddedLanguageFormatting: "off" },
      },
    ],
  },
  lint: {
    // web/studio is a separate Sanity project with its own lockfile, outside
    // the pnpm workspace: its dependencies are not installed here.
    ignorePatterns: ["web/studio/**"],
    // Without typeCheck, `vp check` is oxlint only and passes type errors.
    options: { typeAware: true, typeCheck: true },
  },
};

export default config;
