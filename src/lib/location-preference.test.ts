import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { isAddressPromptDismissed } from "@/lib/location-preference";

describe("delivery address prompt", () => {
  it("stays hidden after a customer has saved a changed address", () => {
    assert.equal(isAddressPromptDismissed("true", "Bengaluru, India", "Romania"), true);
  });

  it("recognizes an older saved address without a change marker", () => {
    assert.equal(isAddressPromptDismissed(null, "Bengaluru, India", "Romania"), true);
  });

  it("remains available when the customer has not changed the default address", () => {
    assert.equal(isAddressPromptDismissed(null, "Romania", "Romania"), false);
    assert.equal(isAddressPromptDismissed(null, null, "Romania"), false);
  });
});