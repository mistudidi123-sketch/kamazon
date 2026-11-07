import { describe, expect, it } from "bun:test";

import { hasSupabaseConfiguration } from "@/lib/cloud-config";

describe("hasSupabaseConfiguration", () => {
  it("accepts a URL and publishable key", () => {
    expect(hasSupabaseConfiguration("https://cloud.example", "sb_publishable_example")).toBe(true);
  });

  it("rejects missing or blank connection settings", () => {
    expect(hasSupabaseConfiguration(undefined, "sb_publishable_example")).toBe(false);
    expect(hasSupabaseConfiguration("https://cloud.example", undefined)).toBe(false);
    expect(hasSupabaseConfiguration("  ", "sb_publishable_example")).toBe(false);
    expect(hasSupabaseConfiguration("https://cloud.example", " ")).toBe(false);
  });
});