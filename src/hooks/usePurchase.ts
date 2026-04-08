// ============================================================
// DataForge - Purchase Hook
// Handles purchasing DataForge Premium via RevenueCat
// ============================================================

import { useCallback, useState } from "react";
import { Purchases } from "@revenuecat/purchases-capacitor";
import { PRODUCT_ID, ENTITLEMENT_ID } from "../config/revenuecat";
import { setPremiumStatus } from "./usePremiumStatus";
import { useAuth } from "../contexts/AuthContext";

export type PurchaseError =
  | "cancelled"
  | "already_owned"
  | "network"
  | "unknown";

interface PurchaseResult {
  success: boolean;
  error?: PurchaseError;
}

interface UsePurchase {
  purchase: () => Promise<PurchaseResult>;
  restore: () => Promise<PurchaseResult>;
  isPurchasing: boolean;
  isRestoring: boolean;
}

export function usePurchase(): UsePurchase {
  const { uid } = useAuth();
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);

  const purchase = useCallback(async (): Promise<PurchaseResult> => {
    setIsPurchasing(true);
    try {
      const { customerInfo } = await Purchases.purchaseStoreProduct({
        product: {
          identifier: PRODUCT_ID,
          // Other fields are populated by the SDK at runtime
        } as never,
      });

      const isPremium =
        customerInfo.entitlements.active[ENTITLEMENT_ID] !== undefined;

      if (isPremium) {
        await setPremiumStatus(true, uid);
        return { success: true };
      }

      // Purchase went through but entitlement not active - should not happen.
      return { success: false, error: "unknown" };
    } catch (err: unknown) {
      const error = err as { code?: string; userCancelled?: boolean };

      if (error.userCancelled || error.code === "1") {
        return { success: false, error: "cancelled" };
      }
      if (error.code === "7") {
        // ITEM_ALREADY_OWNED - grant access.
        await setPremiumStatus(true, uid);
        return { success: true, error: "already_owned" };
      }

      console.error("[DataForge] Purchase failed:", err);
      return { success: false, error: "network" };
    } finally {
      setIsPurchasing(false);
    }
  }, [uid]);

  const restore = useCallback(async (): Promise<PurchaseResult> => {
    setIsRestoring(true);
    try {
      const { customerInfo } = await Purchases.restorePurchases();
      const isPremium =
        customerInfo.entitlements.active[ENTITLEMENT_ID] !== undefined;

      if (isPremium) {
        await setPremiumStatus(true, uid);
        return { success: true };
      }

      // No active entitlement — clear local premium cache (handles refunds)
      await setPremiumStatus(false, uid);
      return { success: false, error: "unknown" };
    } catch (err) {
      console.error("[DataForge] Restore failed:", err);
      return { success: false, error: "network" };
    } finally {
      setIsRestoring(false);
    }
  }, [uid]);

  return { purchase, restore, isPurchasing, isRestoring };
}
