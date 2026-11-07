import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { hasSupabaseConfiguration } from "@/lib/cloud-config";

describe("hasSupabaseConfiguration", () => {
  it("accepts a URL and publishable key", () => {
    assert.equal(hasSupabaseConfiguration("https://cloud.example", "sb_publishable_example"), true);
  });

  it("rejects missing or blank connection settings", () => {
    assert.equal(hasSupabaseConfiguration(undefined, "sb_publishable_example"), false);
    assert.equal(hasSupabaseConfiguration("https://cloud.example", undefined), false);
    assert.equal(hasSupabaseConfiguration("  ", "sb_publishable_example"), false);
    assert.equal(hasSupabaseConfiguration("https://cloud.example", " "), false);
  });
});