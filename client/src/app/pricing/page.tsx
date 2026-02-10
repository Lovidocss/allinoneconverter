import type { Metadata } from "next";
import Link from "next/link";
import {
  Check,
  X,
  Crown,
  Zap,
  Shield,
  Infinity,
  Headphones,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Pricing — 🫶iDocs",
  description:
    "Choose the plan that fits your needs. Free forever or upgrade to Premium for unlimited access.",
};

interface PlanFeature {
  text: string;
  free: boolean;
  premium: boolean;
}

const features: PlanFeature[] = [
  { text: "Basic PDF tools (merge, split, compress)", free: true, premium: true },
  { text: "Convert to/from PDF (common formats)", free: true, premium: true },
  { text: "5 files per day limit", free: true, premium: false },
  { text: "Unlimited file processing", free: false, premium: true },
  { text: "No ads", free: false, premium: true },
  { text: "AI-powered tools (Analyze, OCR, Listen)", free: false, premium: true },
  { text: "Priority processing speed", free: false, premium: true },
  { text: "Batch processing (50+ files)", free: false, premium: true },
  { text: "Max file size: 25MB", free: true, premium: false },
  { text: "Max file size: 500MB", free: false, premium: true },
  { text: "Email support", free: true, premium: true },
  { text: "Priority support", free: false, premium: true },
];

export default function PricingPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
      {/* Header */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-6">
          <Crown className="w-4 h-4" />
          Simple, transparent pricing
        </div>
        <h1 className="text-4xl font-bold">Choose Your Plan</h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto">
          Start free and upgrade when you need more. No hidden fees, cancel
          anytime.
        </p>
      </div>

      {/* Plans */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
        {/* Free Plan */}
        <div className="bg-card border border-border rounded-2xl p-8 flex flex-col">
          <div className="mb-6">
            <h2 className="text-xl font-bold">Free</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Perfect for occasional use
            </p>
          </div>
          <div className="mb-8">
            <span className="text-4xl font-bold">$0</span>
            <span className="text-muted-foreground ml-1">/month</span>
          </div>
          <Link
            href="/auth/signup"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-border rounded-xl font-medium hover:bg-muted transition-colors text-center"
          >
            Get Started Free
          </Link>
          <div className="mt-8 space-y-3 flex-1">
            {features.map((f) => (
              <div key={f.text} className="flex items-start gap-3">
                {f.free ? (
                  <Check className="w-5 h-5 text-success shrink-0 mt-0.5" />
                ) : (
                  <X className="w-5 h-5 text-muted-foreground/40 shrink-0 mt-0.5" />
                )}
                <span
                  className={
                    f.free
                      ? "text-sm"
                      : "text-sm text-muted-foreground/60 line-through"
                  }
                >
                  {f.text}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Premium Plan */}
        <div className="relative bg-card border-2 border-primary rounded-2xl p-8 flex flex-col shadow-lg">
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 gradient-bg text-white text-xs font-bold rounded-full">
            MOST POPULAR
          </div>
          <div className="mb-6">
            <h2 className="text-xl font-bold">Premium</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Unlimited access, no ads, no limits
            </p>
          </div>
          <div className="mb-8">
            <span className="text-4xl font-bold">$9</span>
            <span className="text-muted-foreground ml-1">/month</span>
            <div className="text-xs text-muted-foreground mt-1">
              or $79/year (save 27%)
            </div>
          </div>
          <Link
            href="/auth/signup?plan=premium"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 gradient-bg text-white rounded-xl font-medium hover:opacity-90 transition-opacity text-center"
          >
            <Crown className="w-4 h-4" />
            Start Premium
          </Link>
          <div className="mt-8 space-y-3 flex-1">
            {features.map((f) => (
              <div key={f.text} className="flex items-start gap-3">
                {f.premium ? (
                  <Check className="w-5 h-5 text-success shrink-0 mt-0.5" />
                ) : (
                  <X className="w-5 h-5 text-muted-foreground/40 shrink-0 mt-0.5" />
                )}
                <span
                  className={
                    f.premium
                      ? "text-sm"
                      : "text-sm text-muted-foreground/60 line-through"
                  }
                >
                  {f.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Benefits */}
      <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
        <div>
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Infinity className="w-6 h-6 text-primary" />
          </div>
          <h3 className="font-semibold">Unlimited Access</h3>
          <p className="text-sm text-muted-foreground mt-1">
            No daily limits or file restrictions
          </p>
        </div>
        <div>
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Shield className="w-6 h-6 text-primary" />
          </div>
          <h3 className="font-semibold">Ad-Free Experience</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Clean interface, zero distractions
          </p>
        </div>
        <div>
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Headphones className="w-6 h-6 text-primary" />
          </div>
          <h3 className="font-semibold">Priority Support</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Get help within hours, not days
          </p>
        </div>
      </div>

      {/* FAQ */}
      <div className="mt-20 max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-10">
          Frequently Asked Questions
        </h2>
        <div className="space-y-6">
          {[
            {
              q: "Can I use 🫶iDocs for free?",
              a: "Yes! Our free plan gives you access to all basic PDF tools with a daily limit of 5 files and 25MB max file size.",
            },
            {
              q: "What payment methods do you accept?",
              a: "We accept all major credit cards, PayPal, and support payments through Stripe for secure transactions.",
            },
            {
              q: "Can I cancel my subscription anytime?",
              a: "Absolutely. You can cancel your Premium subscription at any time. You'll retain access until the end of your billing period.",
            },
            {
              q: "Are my files secure?",
              a: "Yes. All files are processed with bank-grade encryption and automatically deleted from our servers within 1 hour of processing.",
            },
            {
              q: "Is there a team or enterprise plan?",
              a: "We're working on team plans. Contact us at support@idocs.app for enterprise inquiries.",
            },
          ].map((faq) => (
            <div
              key={faq.q}
              className="bg-card border border-border rounded-xl p-6"
            >
              <h3 className="font-semibold">{faq.q}</h3>
              <p className="text-sm text-muted-foreground mt-2">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
