"use client";

import { useEffect, useState } from "react";
import {
  Users,
  Crown,
  DollarSign,
  Activity,
  FileText,
  MessageSquare,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import {
  getAdminStats,
  getAdminActivity,
  getRecentUsers,
  getRecentTickets,
} from "@/lib/admin-api";

interface Stats {
  totalUsers: number;
  premiumUsers: number;
  monthlyRevenue: number;
  openTickets: number;
  resolvedTickets: number;
  activeToday: number;
  totalFilesProcessed: number;
  avgSessionTime: string;
  churnRate: number;
  newUsersThisWeek: number;
}

interface ActivityDay {
  date: string;
  users: number;
  filesProcessed: number;
}

interface Ticket {
  _id: string;
  subject: string;
  userName: string;
  category: string;
  status: string;
  priority: string;
}

interface User {
  _id: string;
  name: string;
  email: string;
  subscription: string;
  status: string;
  filesProcessed: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [activity, setActivity] = useState<ActivityDay[]>([]);
  const [recentTickets, setRecentTickets] = useState<Ticket[]>([]);
  const [recentUsers, setRecentUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [statsData, activityData, usersData, ticketsData] = await Promise.all([
          getAdminStats(),
          getAdminActivity(7),
          getRecentUsers(5),
          getRecentTickets(5),
        ]);
        setStats(statsData);
        setActivity(activityData);
        setRecentUsers(usersData);
        setRecentTickets(ticketsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load data");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <p className="text-danger mb-2">Failed to load dashboard data</p>
        <p className="text-sm text-muted-foreground">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Users"
          value={stats.totalUsers.toLocaleString()}
          change={`+${stats.newUsersThisWeek} this week`}
          changeType="positive"
          icon={Users}
        />
        <StatCard
          title="Premium Users"
          value={stats.premiumUsers.toLocaleString()}
          change={`${stats.totalUsers > 0 ? ((stats.premiumUsers / stats.totalUsers) * 100).toFixed(1) : 0}% conversion`}
          changeType="neutral"
          icon={Crown}
        />
        <StatCard
          title="Monthly Revenue"
          value={`$${stats.monthlyRevenue.toLocaleString()}`}
          change="+12.5% vs last month"
          changeType="positive"
          icon={DollarSign}
        />
        <StatCard
          title="Open Tickets"
          value={stats.openTickets.toString()}
          change={`${stats.resolvedTickets} resolved`}
          changeType="neutral"
          icon={MessageSquare}
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Today"
          value={stats.activeToday.toLocaleString()}
          change={`${stats.totalUsers > 0 ? ((stats.activeToday / stats.totalUsers) * 100).toFixed(1) : 0}% of users`}
          changeType="neutral"
          icon={Activity}
          size="small"
        />
        <StatCard
          title="Files Processed"
          value={`${(stats.totalFilesProcessed / 1000000).toFixed(1)}M`}
          change="All time"
          changeType="neutral"
          icon={FileText}
          size="small"
        />
        <StatCard
          title="Avg Session"
          value={stats.avgSessionTime}
          change="+2m vs last week"
          changeType="positive"
          icon={TrendingUp}
          size="small"
        />
        <StatCard
          title="Churn Rate"
          value={`${stats.churnRate}%`}
          change="-0.3% vs last month"
          changeType="positive"
          icon={TrendingDown}
          size="small"
        />
      </div>

      {/* Activity Chart Placeholder */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold">User Activity (Last 7 Days)</h2>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary" />
              <span className="text-muted-foreground">Active Users</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-secondary" />
              <span className="text-muted-foreground">Files Processed</span>
            </div>
          </div>
        </div>
        <div className="h-64 flex items-end gap-4 justify-between">
          {activity.length > 0 ? activity.map((day) => {
            const maxUsers = Math.max(...activity.map(d => d.users), 1);
            const maxFiles = Math.max(...activity.map(d => d.filesProcessed), 1);
            return (
              <div key={day.date} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex gap-1 items-end justify-center h-48">
                  <div
                    className="w-4 bg-primary/80 rounded-t transition-all hover:bg-primary"
                    style={{ height: `${(day.users / maxUsers) * 100}%` }}
                    title={`${day.users} users`}
                  />
                  <div
                    className="w-4 bg-secondary/80 rounded-t transition-all hover:bg-secondary"
                    style={{ height: `${(day.filesProcessed / maxFiles) * 100}%` }}
                    title={`${day.filesProcessed} files`}
                  />
                </div>
                <span className="text-xs text-muted-foreground">{day.date}</span>
              </div>
            );
          }) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              No activity data available
            </div>
          )}
        </div>
      </div>

      {/* Two Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Tickets */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">Recent Tickets</h2>
            <Link
              href="/admin/tickets"
              className="text-sm text-primary hover:underline flex items-center gap-1"
            >
              View all <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-3">
            {recentTickets.length > 0 ? recentTickets.map((ticket) => (
              <div
                key={ticket._id}
                className="flex items-start gap-3 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
              >
                <div
                  className={`w-2 h-2 rounded-full mt-2 shrink-0 ${
                    ticket.priority === "urgent"
                      ? "bg-danger"
                      : ticket.priority === "high"
                      ? "bg-accent"
                      : ticket.priority === "medium"
                      ? "bg-primary"
                      : "bg-muted-foreground"
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{ticket.subject}</p>
                  <p className="text-xs text-muted-foreground">
                    {ticket.userName} · {ticket.category} ·{" "}
                    <span
                      className={
                        ticket.status === "open"
                          ? "text-accent"
                          : ticket.status === "in-progress"
                          ? "text-primary"
                          : "text-success"
                      }
                    >
                      {ticket.status}
                    </span>
                  </p>
                </div>
              </div>
            )) : (
              <p className="text-sm text-muted-foreground text-center py-4">No recent tickets</p>
            )}
          </div>
        </div>

        {/* Recent Users */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">Recent Users</h2>
            <Link
              href="/admin/users"
              className="text-sm text-primary hover:underline flex items-center gap-1"
            >
              View all <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-3">
            {recentUsers.length > 0 ? recentUsers.map((user) => (
              <div
                key={user._id}
                className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
              >
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="text-sm font-bold text-primary">
                    {user.name.charAt(0)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium truncate">{user.name}</p>
                    {user.subscription === "premium" && (
                      <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-accent/10 text-accent">
                        PRO
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground truncate">
                    {user.email}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">
                    {user.filesProcessed || 0} files
                  </p>
                  <p
                    className={`text-xs ${
                      user.status === "active"
                        ? "text-success"
                        : user.status === "suspended"
                        ? "text-accent"
                        : "text-danger"
                    }`}
                  >
                    {user.status}
                  </p>
                </div>
              </div>
            )) : (
              <p className="text-sm text-muted-foreground text-center py-4">No recent users</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Stat Card Component
function StatCard({
  title,
  value,
  change,
  changeType,
  icon: Icon,
  size = "normal",
}: {
  title: string;
  value: string;
  change: string;
  changeType: "positive" | "negative" | "neutral";
  icon: React.ComponentType<{ className?: string }>;
  size?: "normal" | "small";
}) {
  return (
    <div
      className={`bg-card border border-border rounded-2xl ${
        size === "small" ? "p-4" : "p-6"
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className={size === "small" ? "text-xl font-bold mt-1" : "text-3xl font-bold mt-2"}>
            {value}
          </p>
          <p
            className={`text-xs mt-1 ${
              changeType === "positive"
                ? "text-success"
                : changeType === "negative"
                ? "text-danger"
                : "text-muted-foreground"
            }`}
          >
            {change}
          </p>
        </div>
        <div
          className={`${
            size === "small" ? "w-9 h-9" : "w-11 h-11"
          } rounded-xl bg-primary/10 flex items-center justify-center`}
        >
          <Icon className={size === "small" ? "w-4 h-4 text-primary" : "w-5 h-5 text-primary"} />
        </div>
      </div>
    </div>
  );
}
