import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { pushViewItem } from "./gtm";

describe("pushViewItem", () => {
  beforeEach(() => {
    window.dataLayer = [{ "gtm.start": 1 }];
  });

  afterEach(() => {
    delete window.dataLayer;
  });

  it("appends view_item without overwriting existing dataLayer entries", () => {
    pushViewItem({
      itemId: 1231,
      itemName: "2 Step Prime · MatchTrader · $100K",
      price: 275.4,
    });

    expect(window.dataLayer).toHaveLength(2);
    expect(window.dataLayer![0]).toEqual({ "gtm.start": 1 });
    expect(window.dataLayer![1]).toEqual({
      event: "view_item",
      ecommerce: {
        currency: "USD",
        value: 275.4,
        items: [
          {
            item_id: 1231,
            item_name: "2 Step Prime · MatchTrader · $100K",
            price: 275.4,
            quantity: 1,
          },
        ],
      },
    });
  });

  it("never pushes begin_checkout", () => {
    pushViewItem({ itemId: 1, itemName: "Test", price: 10 });
    expect(window.dataLayer!.some((e) => e.event === "begin_checkout")).toBe(false);
    expect(window.dataLayer!.some((e) => e.event === "view_item")).toBe(true);
  });
});
