"use client";

import { useSyncExternalStore, useCallback } from "react";

export interface User {
  id: string;
  email: string;
  name: string;
  role: "user" | "admin";
  subscription: "free" | "pro" | "enterprise";
}

// Cache for the user object to avoid infinite loops with useSyncExternalStore
let cachedUser: User | null = null;
let cachedUserJson: string | null = null;

// External store for auth state
const authStore = {
  getUser(): User | null {
    if (typeof window === "undefined") return null;
    
    const userData = localStorage.getItem("user");
    const token = localStorage.getItem("userToken");
    
    if (!token || !userData) {
      cachedUser = null;
      cachedUserJson = null;
      return null;
    }
    
    // Only parse if the JSON string changed (cache the result)
    if (userData !== cachedUserJson) {
      try {
        cachedUser = JSON.parse(userData);
        cachedUserJson = userData;
      } catch {
        cachedUser = null;
        cachedUserJson = null;
      }
    }
    
    return cachedUser;
  },
  subscribe(callback: () => void): () => void {
    // Listen for storage changes (from other tabs)
    window.addEventListener("storage", callback);
    // Custom event for same-tab updates
    window.addEventListener("auth-change", callback);
    return () => {
      window.removeEventListener("storage", callback);
      window.removeEventListener("auth-change", callback);
    };
  },
  getServerSnapshot(): User | null {
    return null;
  },
};

export function useAuth() {
  const user = useSyncExternalStore(
    authStore.subscribe,
    authStore.getUser,
    authStore.getServerSnapshot
  );

  const logout = useCallback(() => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("user");
    cachedUser = null;
    cachedUserJson = null;
    window.dispatchEvent(new Event("auth-change"));
    window.location.href = "/";
  }, []);

  const isLoggedIn = !!user;
  const isPremium = user?.subscription === "pro" || user?.subscription === "enterprise";
  const isAdmin = user?.role === "admin";

  return {
    user,
    loading: false,
    isLoggedIn,
    isPremium,
    isAdmin,
    logout,
  };
}

// Helper to notify auth changes after login/signup
export function notifyAuthChange() {
  // Clear cache so next getUser() re-parses
  cachedUserJson = null;
  window.dispatchEvent(new Event("auth-change"));
}
