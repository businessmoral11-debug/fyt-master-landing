export interface ViewItemProduct {
  itemId: number | string;
  itemName: string;
  price: number;
  currency?: string;
}

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

/**
 * GA4 ecommerce: homepage "Start Challenge" → view_item only.
 * Does not overwrite dataLayer; never pushes begin_checkout.
 */
export function pushViewItem(product: ViewItemProduct): void {
  if (typeof window === "undefined") return;

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: "view_item",
    ecommerce: {
      currency: product.currency ?? "USD",
      value: product.price,
      items: [
        {
          item_id: product.itemId,
          item_name: product.itemName,
          price: product.price,
          quantity: 1,
        },
      ],
    },
  });
}
