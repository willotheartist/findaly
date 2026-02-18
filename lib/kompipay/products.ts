// lib/kompipay/products.ts
import type { ProductKey } from "@prisma/client";

export type KompiPayProductKey = ProductKey;

/**
 * Map Findaly product keys to KompiPay price keys (created inside KompiPay).
 * Replace the strings with your real KompiPay price keys.
 */
export const KOMPIPAY_PRICE_KEYS: Record<ProductKey, string> = {
  FEATURED_LISTING_14D: "price_featured_listing_14d",
  FEATURED_LISTING_30D: "price_featured_listing_30d",

  BOOST_7D: "price_boost_7d",
  BOOST_14D: "price_boost_14d",

  FINANCE_PRIORITY_14D: "price_finance_priority_14d",
  FINANCE_PRIORITY_30D: "price_finance_priority_30d",

  BROKER_PRO_MONTHLY: "price_broker_pro_monthly",
  VERIFIED_BROKER_MONTHLY: "price_verified_broker_monthly",
};

type Effect =
  | { kind: "FEATURED"; days: number }
  | { kind: "BOOST"; days: number; level: number }
  | { kind: "FINANCE_PRIORITY"; days: number }
  | { kind: "BROKER_PRO"; days: number }
  | { kind: "VERIFIED_BROKER"; days: number };

export const PRODUCT_EFFECTS: Record<ProductKey, Effect> = {
  FEATURED_LISTING_14D: { kind: "FEATURED", days: 14 },
  FEATURED_LISTING_30D: { kind: "FEATURED", days: 30 },

  BOOST_7D: { kind: "BOOST", days: 7, level: 1 },
  BOOST_14D: { kind: "BOOST", days: 14, level: 1 },

  FINANCE_PRIORITY_14D: { kind: "FINANCE_PRIORITY", days: 14 },
  FINANCE_PRIORITY_30D: { kind: "FINANCE_PRIORITY", days: 30 },

  // For monthly products, we still store “active until” for gating UI.
  // Renewal events will extend this. Start with 30 days.
  BROKER_PRO_MONTHLY: { kind: "BROKER_PRO", days: 30 },
  VERIFIED_BROKER_MONTHLY: { kind: "VERIFIED_BROKER", days: 30 },
};
