import { describe, expect, it } from "vitest";
import { stripTrailingSlashes } from "./client";

describe("stripTrailingSlashes", () => {
  it("removes every trailing slash", () => {
    expect(stripTrailingSlashes("https://api.mukoko.com///")).toBe(
      "https://api.mukoko.com",
    );
  });

  it("leaves a URL without a trailing slash untouched", () => {
    expect(stripTrailingSlashes("https://api.mukoko.com/v1")).toBe(
      "https://api.mukoko.com/v1",
    );
  });

  it("stays fast on many non-trailing slashes", () => {
    const hostile = "/".repeat(100_000) + "x";
    const start = performance.now();
    expect(stripTrailingSlashes(hostile)).toBe(hostile);
    expect(performance.now() - start).toBeLessThan(100);
  });
});
