import baseConfig from "./base.js";

/** @type {import("eslint").Linter.Config[]} */
export default [
  ...baseConfig,
  {
    files: ["**/*.ts"],
    languageOptions: {
      globals: {
        // Cloudflare Workers global APIs
        caches: "readonly",
        crypto: "readonly",
        fetch: "readonly",
        Request: "readonly",
        Response: "readonly",
        Headers: "readonly",
        URL: "readonly",
        URLSearchParams: "readonly",
        AbortController: "readonly",
        AbortSignal: "readonly",
        ReadableStream: "readonly",
        WritableStream: "readonly",
        TransformStream: "readonly",
        TextEncoder: "readonly",
        TextDecoder: "readonly",
        setTimeout: "readonly",
        setInterval: "readonly",
        clearTimeout: "readonly",
        clearInterval: "readonly",
        console: "readonly",
        atob: "readonly",
        btoa: "readonly",
        navigator: "readonly",
        structuredClone: "readonly",
      },
    },
    rules: {
      "no-restricted-globals": [
        "error",
        {
          name: "process",
          message: "process is not available in Cloudflare Workers.",
        },
        {
          name: "__dirname",
          message: "__dirname is not available in Cloudflare Workers.",
        },
        {
          name: "__filename",
          message: "__filename is not available in Cloudflare Workers.",
        },
        {
          name: "Buffer",
          message:
            "Buffer is not available in Cloudflare Workers. Use Uint8Array instead.",
        },
      ],
    },
  },
];
