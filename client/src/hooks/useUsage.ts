"use client";

import { useSyncExternalStore, useCallback } from "react";

export interface UsageData {
  filesProcessedToday: number;
  totalFilesProcessed: number;
  storageUsedMB: number;
  lastResetDate: string; // ISO date string
}

const DEFAULT_USAGE: UsageData = {
  filesProcessedToday: 0,
  totalFilesProcessed: 0,
  storageUsedMB: 0,
  lastResetDate: new Date().toISOString().split("T")[0],
};

// Constants for tracking (no limits - unlimited for all users)
export const STORAGE_LIMIT_MB = Infinity; // No limit

// Cache for usage data
let cachedUsage: UsageData | null = null;
let cachedUsageJson: string | null = null;

function getTodayDate(): string {
  return new Date().toISOString().split("T")[0];
}

const usageStore = {
  getUsage(): UsageData {
    if (typeof window === "undefined") return DEFAULT_USAGE;

    const usageData = localStorage.getItem("pdfUsage");

    if (!usageData) {
      // Initialize with defaults
      const initial = { ...DEFAULT_USAGE, lastResetDate: getTodayDate() };
      localStorage.setItem("pdfUsage", JSON.stringify(initial));
      cachedUsage = initial;
      cachedUsageJson = JSON.stringify(initial);
      return initial;
    }

    // Only parse if changed
    if (usageData !== cachedUsageJson) {
      try {
        cachedUsage = JSON.parse(usageData);
        cachedUsageJson = usageData;

        // Check if we need to reset daily counter
        if (cachedUsage && cachedUsage.lastResetDate !== getTodayDate()) {
          cachedUsage = {
            ...cachedUsage,
            filesProcessedToday: 0,
            lastResetDate: getTodayDate(),
          };
          localStorage.setItem("pdfUsage", JSON.stringify(cachedUsage));
          cachedUsageJson = JSON.stringify(cachedUsage);
        }
      } catch {
        cachedUsage = { ...DEFAULT_USAGE, lastResetDate: getTodayDate() };
        cachedUsageJson = JSON.stringify(cachedUsage);
      }
    }

    return cachedUsage || DEFAULT_USAGE;
  },

  subscribe(callback: () => void): () => void {
    window.addEventListener("storage", callback);
    window.addEventListener("usage-change", callback);
    return () => {
      window.removeEventListener("storage", callback);
      window.removeEventListener("usage-change", callback);
    };
  },

  getServerSnapshot(): UsageData {
    return DEFAULT_USAGE;
  },
};

export function useUsage() {
  const usage = useSyncExternalStore(
    usageStore.subscribe,
    usageStore.getUsage,
    usageStore.getServerSnapshot
  );

  const incrementUsage = useCallback((fileSizeMB: number = 0) => {
    const current = usageStore.getUsage();
    const updated: UsageData = {
      ...current,
      filesProcessedToday: current.filesProcessedToday + 1,
      totalFilesProcessed: current.totalFilesProcessed + 1,
      storageUsedMB: current.storageUsedMB + fileSizeMB,
      lastResetDate: getTodayDate(),
    };

    localStorage.setItem("pdfUsage", JSON.stringify(updated));
    cachedUsage = updated;
    cachedUsageJson = JSON.stringify(updated);
    window.dispatchEvent(new Event("usage-change"));
  }, []);

  const resetUsage = useCallback(() => {
    const fresh = { ...DEFAULT_USAGE, lastResetDate: getTodayDate() };
    localStorage.setItem("pdfUsage", JSON.stringify(fresh));
    cachedUsage = fresh;
    cachedUsageJson = JSON.stringify(fresh);
    window.dispatchEvent(new Event("usage-change"));
  }, []);

  return {
    usage,
    incrementUsage,
    resetUsage,
  };
}

// All users have unlimited processing
export function canProcessFile(): boolean {
  return true; // Unlimited for everyone
}
