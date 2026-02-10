"use client";

import { useState, useEffect, useCallback } from "react";
import {
  TrendingUp,
  TrendingDown,
  Users,
  FileText,
  DollarSign,
  Activity,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui";
import { getAnalytics } from "@/lib/admin-api";

interface AnalyticsData {
  userGrowth: { date: string; count: number }[];
  fileActivity: { date: string; count: number }[];
  revenueData: { date: string; amount: number }[];
  topTools: { name: string; usage: number }[];
  usersByPlan: { plan: string; count: number }[];
  metrics: {
    totalUsers: number;
    userGrowthPercent: number;
    totalFiles: number;
    fileGrowthPercent: number;
    totalRevenue: number;
    revenueGrowthPercent: number;
    avgSessionTime: string;
    sessionGrowthPercent: number;
  };
}

export default function AdminAnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(30);

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAnalytics(days);
      setAnalytics(data);
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
    } finally {
      setLoading(false);
    }
  }, [days]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const metrics = analytics?.metrics || {
    totalUsers: 0,
    userGrowthPercent: 0,
    totalFiles: 0,
    fileGrowthPercent: 0,
    totalRevenue: 0,
    revenueGrowthPercent: 0,
    avgSessionTime: "0m",
    sessionGrowthPercent: 0,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Analytics</h1>
          <p className="text-muted-foreground">
            Detailed insights and performance metrics
          </p>
        </div>
        <div className="flex gap-2">
          <select
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            className="px-3 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none cursor-pointer"
          >
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
          </select>
          <Button variant="outline" size="sm" onClick={fetchAnalytics}>
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Users"
          value={metrics.totalUsers.toLocaleString()}
          change={metrics.userGrowthPercent}
          icon={Users}
        />
        <MetricCard
          title="Files Processed"
          value={formatLargeNumber(metrics.totalFiles)}
          change={metrics.fileGrowthPercent}
          icon={FileText}
        />
        <MetricCard
          title="Total Revenue"
          value={`$${metrics.totalRevenue.toLocaleString()}`}
          change={metrics.revenueGrowthPercent}
          icon={DollarSign}
        />
        <MetricCard
          title="Avg Session Time"
          value={metrics.avgSessionTime}
          change={metrics.sessionGrowthPercent}
          icon={Activity}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth Chart */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold">User Growth</h2>
            <Users className="w-5 h-5 text-muted-foreground" />
          </div>
          <div className="h-48 flex items-end gap-1">
            {(analytics?.userGrowth || generatePlaceholderData(days)).map((item, i) => {
              const maxCount = Math.max(...(analytics?.userGrowth || [{ count: 100 }]).map(d => d.count), 1);
              return (
                <div
                  key={i}
                  className="flex-1 bg-primary/80 rounded-t hover:bg-primary transition-colors cursor-pointer"
                  style={{ height: `${(item.count / maxCount) * 100}%`, minHeight: "4px" }}
                  title={`${item.date}: ${item.count} users`}
                />
              );
            })}
          </div>
          <div className="flex justify-between mt-2 text-xs text-muted-foreground">
            <span>{days} days ago</span>
            <span>Today</span>
          </div>
        </div>

        {/* Revenue Chart */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold">Revenue</h2>
            <DollarSign className="w-5 h-5 text-muted-foreground" />
          </div>
          <div className="h-48 flex items-end gap-1">
            {(analytics?.revenueData || generatePlaceholderData(days)).map((item, i) => {
              const maxAmount = Math.max(...(analytics?.revenueData || [{ amount: 100 }]).map(d => d.amount), 1);
              return (
                <div
                  key={i}
                  className="flex-1 bg-success/80 rounded-t hover:bg-success transition-colors cursor-pointer"
                  style={{ height: `${(item.amount / maxAmount) * 100}%`, minHeight: "4px" }}
                  title={`${item.date}: $${item.amount}`}
                />
              );
            })}
          </div>
          <div className="flex justify-between mt-2 text-xs text-muted-foreground">
            <span>{days} days ago</span>
            <span>Today</span>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Tools */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <h2 className="text-lg font-bold mb-4">Top Tools</h2>
          <div className="space-y-3">
            {(analytics?.topTools || [
              { name: "PDF Merge", usage: 45 },
              { name: "PDF Compress", usage: 30 },
              { name: "PDF to Word", usage: 15 },
              { name: "Image to PDF", usage: 10 },
            ]).map((tool, i) => {
              const maxUsage = Math.max(...(analytics?.topTools || [{ usage: 100 }]).map(t => t.usage), 1);
              return (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-sm font-mono text-muted-foreground w-6">
                    #{i + 1}
                  </span>
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">{tool.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {tool.usage.toLocaleString()} uses
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all"
                        style={{ width: `${(tool.usage / maxUsage) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* User Distribution */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <h2 className="text-lg font-bold mb-4">User Distribution</h2>
          <div className="flex items-center justify-center h-48">
            <div className="relative w-40 h-40">
              {/* Simple pie chart visualization */}
              <div className="absolute inset-0 rounded-full bg-muted" />
              <div className="absolute inset-4 rounded-full bg-card flex items-center justify-center">
                <div className="text-center">
                  <p className="text-2xl font-bold">
                    {analytics?.usersByPlan?.find(p => p.plan === "Premium")?.count || 25}%
                  </p>
                  <p className="text-xs text-muted-foreground">Premium</p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-center gap-6 mt-4">
            {(analytics?.usersByPlan || [
              { plan: "Free", count: 75 },
              { plan: "Premium", count: 25 },
            ]).map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <div
                  className={`w-3 h-3 rounded-full ${
                    item.plan === "Premium" ? "bg-accent" : "bg-muted-foreground"
                  }`}
                />
                <span className="text-sm">
                  {item.plan} ({item.count}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* File Activity */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold">File Processing Activity</h2>
          <FileText className="w-5 h-5 text-muted-foreground" />
        </div>
        <div className="h-48 flex items-end gap-1">
          {(analytics?.fileActivity || generatePlaceholderData(days)).map((item, i) => {
            const maxCount = Math.max(...(analytics?.fileActivity || [{ count: 100 }]).map(d => d.count), 1);
            return (
              <div
                key={i}
                className="flex-1 bg-secondary/80 rounded-t hover:bg-secondary transition-colors cursor-pointer"
                style={{ height: `${(item.count / maxCount) * 100}%`, minHeight: "4px" }}
                title={`${item.date}: ${item.count} files`}
              />
            );
          })}
        </div>
        <div className="flex justify-between mt-2 text-xs text-muted-foreground">
          <span>{days} days ago</span>
          <span>Today</span>
        </div>
      </div>
    </div>
  );
}

function MetricCard({
  title,
  value,
  change,
  icon: Icon,
}: {
  title: string;
  value: string;
  change: number;
  icon: React.ComponentType<{ className?: string }>;
}) {
  const isPositive = change >= 0;

  return (
    <div className="bg-card border border-border rounded-2xl p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold mt-2">{value}</p>
          <div className="flex items-center gap-1 mt-2">
            {isPositive ? (
              <TrendingUp className="w-4 h-4 text-success" />
            ) : (
              <TrendingDown className="w-4 h-4 text-danger" />
            )}
            <span
              className={`text-sm font-medium ${
                isPositive ? "text-success" : "text-danger"
              }`}
            >
              {isPositive ? "+" : ""}
              {change.toFixed(1)}%
            </span>
            <span className="text-sm text-muted-foreground">vs last period</span>
          </div>
        </div>
        <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center">
          <Icon className="w-5 h-5 text-primary" />
        </div>
      </div>
    </div>
  );
}

function formatLargeNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
}

function generatePlaceholderData(days: number): { date: string; count: number; amount: number }[] {
  return Array.from({ length: Math.min(days, 30) }, (_, i) => ({
    date: new Date(Date.now() - (days - i) * 24 * 60 * 60 * 1000).toLocaleDateString(),
    count: Math.floor(Math.random() * 100) + 10,
    amount: Math.floor(Math.random() * 100) + 10,
  }));
}
