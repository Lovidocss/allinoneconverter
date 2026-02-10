"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Crown,
  Check,
  CreditCard,
  Calendar,
  AlertCircle,
  Download,
  RefreshCcw,
} from "lucide-react";
import { Button } from "@/components/ui";

export default function SubscriptionPage() {
  const [showCancelModal, setShowCancelModal] = useState(false);

  // Mock subscription data
  const subscription = {
    plan: "free" as "free" | "premium",
    // For premium users:
    // plan: "premium",
    // billingCycle: "monthly" as "monthly" | "yearly",
    // amount: 9,
    // nextBillingDate: "2026-03-06",
    // paymentMethod: "Visa •••• 4242",
    // startDate: "2025-10-06",
  };

  const isPremium = subscription.plan === "premium";

  return (
    <div className="max-w-3xl space-y-6">
      {/* Current Plan */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <h2 className="text-lg font-bold mb-4">Current Plan</h2>
        
        <div className={`p-6 rounded-xl ${isPremium ? "bg-accent/5 border border-accent/20" : "bg-muted"}`}>
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                {isPremium && <Crown className="w-5 h-5 text-accent" />}
                <h3 className="text-xl font-bold capitalize">{subscription.plan}</h3>
              </div>
              {isPremium ? (
                <p className="text-muted-foreground mt-1">
                  Unlimited access to all features
                </p>
              ) : (
                <p className="text-muted-foreground mt-1">
                  5 files/day · 25MB max · Basic tools
                </p>
              )}
            </div>
            {!isPremium && (
              <Link href="/pricing">
                <Button>
                  <Crown className="w-4 h-4" />
                  Upgrade
                </Button>
              </Link>
            )}
          </div>

          {isPremium && (
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-muted-foreground">Billing Cycle</p>
                <p className="text-sm font-medium mt-1 flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Monthly
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Amount</p>
                <p className="text-sm font-medium mt-1">$9/month</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Next Billing</p>
                <p className="text-sm font-medium mt-1">March 6, 2026</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Benefits */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <h2 className="text-lg font-bold mb-4">
          {isPremium ? "Your Premium Benefits" : "Premium Benefits"}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            "Unlimited file processing",
            "No daily limits",
            "Max file size: 500MB",
            "AI-powered tools",
            "Batch processing (50+ files)",
            "No advertisements",
            "Priority processing speed",
            "Priority email support",
          ].map((benefit) => (
            <div key={benefit} className="flex items-center gap-2">
              <Check
                className={`w-4 h-4 shrink-0 ${
                  isPremium ? "text-success" : "text-muted-foreground"
                }`}
              />
              <span className={isPremium ? "" : "text-muted-foreground"}>
                {benefit}
              </span>
            </div>
          ))}
        </div>
        {!isPremium && (
          <Link href="/pricing" className="mt-6 block">
            <Button className="w-full">
              <Crown className="w-4 h-4" />
              Upgrade to Premium — $9/month
            </Button>
          </Link>
        )}
      </div>

      {/* Payment Method (Premium only) */}
      {isPremium && (
        <div className="bg-card border border-border rounded-2xl p-6">
          <h2 className="text-lg font-bold mb-4">Payment Method</h2>
          <div className="flex items-center justify-between p-4 bg-muted rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-background border border-border flex items-center justify-center">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-medium">Visa •••• 4242</p>
                <p className="text-xs text-muted-foreground">Expires 12/2027</p>
              </div>
            </div>
            <Button variant="outline" size="sm">
              Update
            </Button>
          </div>
        </div>
      )}

      {/* Billing History (Premium only) */}
      {isPremium && (
        <div className="bg-card border border-border rounded-2xl p-6">
          <h2 className="text-lg font-bold mb-4">Billing History</h2>
          <div className="space-y-2">
            {[
              { date: "Feb 6, 2026", amount: "$9.00", status: "Paid" },
              { date: "Jan 6, 2026", amount: "$9.00", status: "Paid" },
              { date: "Dec 6, 2025", amount: "$9.00", status: "Paid" },
              { date: "Nov 6, 2025", amount: "$9.00", status: "Paid" },
            ].map((invoice, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                    <Download className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{invoice.date}</p>
                    <p className="text-xs text-muted-foreground">
                      Premium Monthly
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{invoice.amount}</p>
                  <p className="text-xs text-success">{invoice.status}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Cancel Subscription (Premium only) */}
      {isPremium && (
        <div className="bg-card border border-border rounded-2xl p-6">
          <h2 className="text-lg font-bold mb-2">Cancel Subscription</h2>
          <p className="text-sm text-muted-foreground mb-4">
            You can cancel anytime. You&apos;ll retain access until the end of your
            current billing period.
          </p>
          <Button
            variant="outline"
            onClick={() => setShowCancelModal(true)}
            className="text-danger hover:bg-danger/10 hover:text-danger"
          >
            Cancel Subscription
          </Button>
        </div>
      )}

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="bg-card border border-border rounded-2xl p-6 max-w-md w-full mx-4">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-danger/10 flex items-center justify-center shrink-0">
                <AlertCircle className="w-5 h-5 text-danger" />
              </div>
              <div>
                <h3 className="font-bold">Cancel your subscription?</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  You&apos;ll lose access to premium features at the end of your billing
                  period (March 6, 2026).
                </p>
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={() => setShowCancelModal(false)}>
                Keep Premium
              </Button>
              <Button variant="danger">Confirm Cancel</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
