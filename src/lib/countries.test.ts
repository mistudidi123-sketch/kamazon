import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { COUNTRIES, getCountry } from "@/lib/countries";

describe("country choices", () => {
  it("includes all 249 ISO country and territory entries", () => {
    assert.equal(COUNTRIES.length, 249);
  });

  it("lists every country alphabetically and resolves the selected country", () => {
    const sortedNames = COUNTRIES.map((country) => country.name).toSorted((left, right) => left.localeCompare(right, "en"));
    assert.deepEqual(COUNTRIES.map((country) => country.name), sortedNames);
    assert.deepEqual(getCountry("IN"), { code: "IN", name: "India" });
  });
});