"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Search,
  MoreHorizontal,
  CreditCard,
  Calendar,
  AlertCircle,
  CheckCircle,
  XCircle,
  RefreshCcw,
  Mail,
  Ban,
  DollarSign,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui";
import { getSubscriptions, type SubscriptionFilters } from "@/lib/admin-api";

interface Subscription {
  _id: string;
  userName: string;
  userEmail: string;
  plan: "monthly" | "yearly";
  status: "active" | "cancelled" | "expired" | "past_due";
  amount: number;
  nextBilling: string;
  paymentMethod: string;
}

interface SubscriptionStats {
  totalMRR: number;
  activeSubs: number;
  pastDue: number;
}

export default function AdminSubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [stats, setStats] = useState<SubscriptionStats>({ totalMRR: 0, activeSubs: 0, pastDue: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "cancelled" | "expired" | "past_due">("all");
  const [filterPlan, setFilterPlan] = useState<"all" | "monthly" | "yearly">("all");

  const fetchSubscriptions = useCallback(async () => {
    try {
      setLoading(true);
      const filters: SubscriptionFilters = {
        search: search || undefined,
        plan: filterPlan !== "all" ? filterPlan : undefined,
        status: filterStatus !== "all" ? filterStatus : undefined,
      };
      const data = await getSubscriptions(filters);
      setSubscriptions(data.subscriptions);
      setStats({
        totalMRR: data.totalMRR || 0,
        activeSubs: data.activeSubs || 0,
        pastDue: data.pastDue || 0,
      });
    } catch (error) {
      console.error("Failed to fetch subscriptions:", error);
    } finally {
      setLoading(false);
    }
  }, [search, filterStatus, filterPlan]);

  useEffect(() => {
    fetchSubscriptions();
  }, [fetchSubscriptions]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchSubscriptions();
    }, 300);
    return () => clearTimeout(timer);
  }, [search, fetchSubscriptions]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Subscriptions</h1>
          <p className="text-muted-foreground">
            Manage premium user subscriptions
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={fetchSubscriptions}>
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            Export Report
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold">${stats.totalMRR.toFixed(0)}</p>
              <p className="text-sm text-muted-foreground">Monthly Revenue</p>
            </div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.activeSubs}</p>
              <p className="text-sm text-muted-foreground">Active Subscriptions</p>
            </div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-danger/10 flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-danger" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.pastDue}</p>
              <p className="text-sm text-muted-foreground">Past Due</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={filterPlan}
            onChange={(e) => setFilterPlan(e.target.value as "all" | "monthly" | "yearly")}
            className="px-3 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 cursor-pointer"
          >
            <option value="all">All Plans</option>
            <option value="monthly">Monthly ($9)</option>
            <option value="yearly">Yearly ($79)</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) =>
              setFilterStatus(
                e.target.value as "all" | "active" | "cancelled" | "expired" | "past_due"
              )
            }
            className="px-3 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 cursor-pointer"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="cancelled">Cancelled</option>
            <option value="expired">Expired</option>
            <option value="past_due">Past Due</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="p-4 text-left text-sm font-semibold">User</th>
                  <th className="p-4 text-left text-sm font-semibold">Plan</th>
                  <th className="p-4 text-left text-sm font-semibold">Status</th>
                  <th className="p-4 text-left text-sm font-semibold">Amount</th>
                  <th className="p-4 text-left text-sm font-semibold">Next Billing</th>
                  <th className="p-4 text-left text-sm font-semibold">Payment Method</th>
                  <th className="p-4 text-right text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {subscriptions.map((sub) => (
                  <SubscriptionRow key={sub._id} subscription={sub} />
                ))}
                {subscriptions.length === 0 && (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-muted-foreground">
                      No subscriptions found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function SubscriptionRow({ subscription }: { subscription: Subscription }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <tr className="border-b border-border hover:bg-muted/30 transition-colors">
      <td className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <span className="text-sm font-bold text-primary">
              {subscription.userName.charAt(0)}
            </span>
          </div>
          <div>
            <p className="text-sm font-medium">{subscription.userName}</p>
            <p className="text-xs text-muted-foreground">{subscription.userEmail}</p>
          </div>
        </div>
      </td>
      <td className="p-4">
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-muted text-xs font-medium capitalize">
          <Calendar className="w-3 h-3" />
          {subscription.plan}
        </span>
      </td>
      <td className="p-4">
        <span
          className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium ${
            subscription.status === "active"
              ? "bg-success/10 text-success"
              : subscription.status === "past_due"
              ? "bg-danger/10 text-danger"
              : subscription.status === "cancelled"
              ? "bg-muted text-muted-foreground"
              : "bg-accent/10 text-accent"
          }`}
        >
          {subscription.status === "active" ? (
            <CheckCircle className="w-3 h-3" />
          ) : subscription.status === "past_due" ? (
            <AlertCircle className="w-3 h-3" />
          ) : (
            <XCircle className="w-3 h-3" />
          )}
          {subscription.status.replace("_", " ")}
        </span>
      </td>
      <td className="p-4">
        <p className="text-sm font-medium">${subscription.amount}</p>
        <p className="text-xs text-muted-foreground">
          {subscription.plan === "monthly" ? "/month" : "/year"}
        </p>
      </td>
      <td className="p-4 text-sm text-muted-foreground">
        {subscription.nextBilling ? formatDate(subscription.nextBilling) : "N/A"}
      </td>
      <td className="p-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <CreditCard className="w-4 h-4" />
          {subscription.paymentMethod || "N/A"}
        </div>
      </td>
      <td className="p-4 text-right relative">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="p-2 rounded-lg hover:bg-muted cursor-pointer"
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>
        {menuOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setMenuOpen(false)}
            />
            <div className="absolute right-4 top-full mt-1 w-44 bg-card border border-border rounded-xl shadow-lg z-50 py-1">
              <button className="w-full px-3 py-2 text-left text-sm hover:bg-muted flex items-center gap-2 cursor-pointer">
                <RefreshCcw className="w-4 h-4" />
                Retry Payment
              </button>
              <button className="w-full px-3 py-2 text-left text-sm hover:bg-muted flex items-center gap-2 cursor-pointer">
                <Mail className="w-4 h-4" />
                Send Invoice
              </button>
              <button className="w-full px-3 py-2 text-left text-sm hover:bg-muted flex items-center gap-2 cursor-pointer">
                <Calendar className="w-4 h-4" />
                Extend Trial
              </button>
              <hr className="my-1 border-border" />
              <button className="w-full px-3 py-2 text-left text-sm hover:bg-muted flex items-center gap-2 text-danger cursor-pointer">
                <Ban className="w-4 h-4" />
                Cancel Subscription
              </button>
            </div>
          </>
        )}
      </td>
    </tr>
  );
}
