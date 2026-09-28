import { describe, it, expect } from "vitest";
import { buildAutoplayPlugins } from "./emblaAutoplay";

describe("buildAutoplayPlugins", () => {
  it("returns no plugins when the user prefers reduced motion", () => {
    expect(buildAutoplayPlugins(true)).toEqual([]);
  });

  it("returns exactly one plugin when motion is allowed", () => {
    const plugins = buildAutoplayPlugins(false);
    expect(plugins).toHaveLength(1);
  });

  it("accepts custom delay/stopOnInteraction options", () => {
    const plugins = buildAutoplayPlugins(false, { delay: 6000, stopOnInteraction: true });
    expect(plugins).toHaveLength(1);
  });

  it("does not force stopOnInteraction when the caller doesn't specify it (lets embla's own true default apply)", () => {
    const [plugin] = buildAutoplayPlugins(false);
    expect(Object.prototype.hasOwnProperty.call(plugin.options, "stopOnInteraction")).toBe(false);
  });

  it("respects an explicit stopOnInteraction override when the caller provides one", () => {
    const [plugin] = buildAutoplayPlugins(false, { stopOnInteraction: false });
    expect(Object.prototype.hasOwnProperty.call(plugin.options, "stopOnInteraction")).toBe(true);
    expect((plugin.options as { stopOnInteraction?: boolean }).stopOnInteraction).toBe(false);
  });
});
