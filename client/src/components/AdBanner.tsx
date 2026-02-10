"use client";

import { X } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

interface AdBannerProps {
  variant?: "horizontal" | "sidebar" | "inline";
  className?: string;
}

export function AdBanner({ variant = "horizontal", className = "" }: AdBannerProps) {
  const { isPremium } = useAuth();
  const [dismissed, setDismissed] = useState(false);

  // Don't show ads to premium users
  if (isPremium || dismissed) return null;

  if (variant === "sidebar") {
    return (
      <div className={`bg-muted/50 border border-border rounded-2xl p-4 relative ${className}`}>
        <button
          onClick={() => setDismissed(true)}
          className="absolute top-2 right-2 p-1 hover:bg-muted rounded-lg transition-colors cursor-pointer"
          aria-label="Dismiss ad"
        >
          <X className="w-3 h-3 text-muted-foreground" />
        </button>
        <p className="text-[10px] text-muted-foreground mb-2">ADVERTISEMENT</p>
        <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl h-48 flex items-center justify-center">
          <div className="text-center p-4">
            <p className="text-sm font-medium">Your Ad Here</p>
            <p className="text-xs text-muted-foreground mt-1">300x250</p>
          </div>
        </div>
        <Link
          href="/pricing"
          className="block mt-3 text-xs text-center text-primary hover:underline"
        >
          Remove ads with Premium →
        </Link>
      </div>
    );
  }

  if (variant === "inline") {
    return (
      <div className={`bg-muted/30 border border-dashed border-border rounded-xl p-3 ${className}`}>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg flex items-center justify-center">
              <span className="text-xs text-muted-foreground">Ad</span>
            </div>
            <div>
              <p className="text-sm font-medium">Sponsored Content</p>
              <p className="text-xs text-muted-foreground">Advertisement placeholder</p>
            </div>
          </div>
          <button
            onClick={() => setDismissed(true)}
            className="p-1 hover:bg-muted rounded-lg transition-colors cursor-pointer"
            aria-label="Dismiss"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </div>
    );
  }

  // Horizontal banner (default)
  return (
    <div className={`bg-muted/50 border border-border rounded-2xl p-4 relative ${className}`}>
      <button
        onClick={() => setDismissed(true)}
        className="absolute top-3 right-3 p-1.5 hover:bg-muted rounded-lg transition-colors cursor-pointer"
        aria-label="Dismiss ad"
      >
        <X className="w-4 h-4 text-muted-foreground" />
      </button>
      <p className="text-[10px] text-muted-foreground mb-2">ADVERTISEMENT</p>
      <div className="bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-xl h-24 flex items-center justify-center">
        <div className="text-center">
          <p className="text-sm font-medium">Banner Ad Placeholder</p>
          <p className="text-xs text-muted-foreground mt-1">728x90 • Leaderboard</p>
        </div>
      </div>
      <div className="flex items-center justify-between mt-2">
        <span className="text-[10px] text-muted-foreground">Ads help keep this service free</span>
        <Link href="/pricing" className="text-xs text-primary hover:underline">
          Go ad-free →
        </Link>
      </div>
    </div>
  );
}
