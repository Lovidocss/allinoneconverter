"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  FileText,
  Upload,
  Download,
  Crown,
  Clock,
  ArrowRight,
  Zap,
  Shield,
  Loader2,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useFileHistory, formatFileSize, formatRelativeTime } from "@/hooks/useFileHistory";
import { AdBanner } from "@/components/AdBanner";

export default function DashboardPage() {
  const router = useRouter();
  const { user, isLoggedIn, isPremium } = useAuth();
  const { history, stats, loading: historyLoading } = useFileHistory();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/auth/signin");
    }
  }, [isLoggedIn, router]);

  // Show loading or redirect while checking auth
  if (!isLoggedIn || !user) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  // All users have unlimited usage - premium only removes ads

  // Get recent 5 files from real history
  const recentFiles = history.slice(0, 5);

  const quickTools = [
    { slug: "merge-pdf", name: "Merge PDF", icon: "Merge" },
    { slug: "compress-pdf", name: "Compress", icon: "Minimize2" },
    { slug: "split-pdf", name: "Split PDF", icon: "Scissors" },
    { slug: "pdf-to-word", name: "To Word", icon: "FileText" },
    { slug: "jpg-to-pdf", name: "JPG to PDF", icon: "Image" },
    { slug: "sign-pdf", name: "Sign PDF", icon: "PenLine" },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Welcome back, {user.name.split(" ")[0]}!</h1>
          <p className="text-muted-foreground">
            {isPremium
              ? "Premium member - No ads"
              : "Unlimited processing available"}
          </p>
        </div>
        {!isPremium && (
          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 px-4 py-2 bg-foreground text-background rounded-xl text-sm font-medium hover:opacity-90 transition-opacity"
          >
            <Crown className="w-4 h-4" />
            Go Ad-Free
          </Link>
        )}
      </div>

      {/* Ad Banner for free users */}
      <AdBanner variant="horizontal" />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Today&apos;s Files</p>
              <p className="text-2xl font-bold mt-1">
                {stats?.todayFiles || 0}
              </p>
              <p className="text-xs text-muted-foreground">processed today</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <Upload className="w-5 h-5 text-blue-500" />
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Files</p>
              <p className="text-2xl font-bold mt-1">{stats?.totalFiles || 0}</p>
              <p className="text-xs text-muted-foreground">all time</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
              <FileText className="w-5 h-5 text-green-500" />
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Storage Used</p>
              <p className="text-2xl font-bold mt-1">
                {((stats?.totalStorageBytes || 0) / (1024 * 1024)).toFixed(1)}
                <span className="text-sm font-normal text-muted-foreground"> MB</span>
              </p>
              <p className="text-xs text-muted-foreground">total processed</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
              <Download className="w-5 h-5 text-purple-500" />
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Current Plan</p>
              <p className="text-2xl font-bold mt-1 capitalize flex items-center gap-2">
                {isPremium && <Crown className="w-5 h-5 text-amber-500" />}
                {user.subscription}
              </p>
              {!isPremium && (
                <Link
                  href="/pricing"
                  className="text-xs text-blue-500 hover:underline"
                >
                  Upgrade →
                </Link>
              )}
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
              <Shield className="w-5 h-5 text-amber-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Tools */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold">Quick Tools</h2>
          <Link
            href="/#all-tools"
            className="text-sm text-blue-500 hover:underline flex items-center gap-1"
          >
            View All <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {quickTools.map((tool) => (
            <Link
              key={tool.slug}
              href={`/tool/${tool.slug}`}
              className="flex flex-col items-center gap-2 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors text-center group"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                <Zap className="w-5 h-5 text-blue-500" />
              </div>
              <span className="text-xs font-medium">{tool.name}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Files */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold">Recent Files</h2>
          <Link
            href="/dashboard/history"
            className="text-sm text-blue-500 hover:underline flex items-center gap-1"
          >
            View All <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        {historyLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 text-muted-foreground animate-spin" />
          </div>
        ) : recentFiles.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="w-10 h-10 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No files processed yet</p>
            <Link
              href="/"
              className="text-blue-500 text-sm hover:underline mt-1 inline-block"
            >
              Start with a tool →
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {recentFiles.map((file) => (
              <div
                key={file._id}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors"
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    file.status === "completed"
                      ? "bg-green-500/10"
                      : file.status === "processing"
                      ? "bg-blue-500/10"
                      : "bg-red-500/10"
                  }`}
                >
                  {file.status === "completed" ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : file.status === "processing" ? (
                    <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{file.originalName}</p>
                  <p className="text-xs text-muted-foreground">
                    {file.toolName} · {formatFileSize(file.fileSize)}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatRelativeTime(file.createdAt)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Inline Ad */}
      <AdBanner variant="inline" />

      {/* Upgrade Banner (for free users) */}
      {!isPremium && (
        <div className="bg-foreground rounded-2xl p-8 text-background">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Crown className="w-6 h-6" />
                Unlock Premium Features
              </h3>
              <p className="text-background/70 mt-2 max-w-md">
                Get unlimited file processing, no ads, AI-powered tools, and priority support.
              </p>
            </div>
            <Link
              href="/pricing"
              className="px-6 py-3 bg-background text-foreground font-medium rounded-xl hover:bg-background/90 transition-colors shrink-0"
            >
              Upgrade for $9/mo
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
