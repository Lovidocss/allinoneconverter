"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";
import {
  LayoutDashboard,
  CreditCard,
  MessageSquare,
  Settings,
  FileText,
  History,
  Crown,
  LogOut,
  ChevronLeft,
  ChevronRight,
  User,
} from "lucide-react";

const userNav = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/history", label: "File History", icon: History },
  { href: "/dashboard/subscription", label: "Subscription", icon: CreditCard },
  { href: "/dashboard/tickets", label: "Support", icon: MessageSquare },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  // Mock user data
  const user = {
    name: "John Doe",
    email: "john@example.com",
    plan: "free" as "free" | "premium",
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside
        className={clsx(
          "fixed left-0 top-0 h-full bg-card border-r border-border flex flex-col transition-all duration-300 z-40",
          collapsed ? "w-[68px]" : "w-64"
        )}
      >
        {/* Logo */}
        <div className="p-4 border-b border-border flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 gradient-bg rounded-xl flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5 text-white" />
            </div>
            {!collapsed && (
              <span className="text-lg font-bold">
                AllInOne<span className="gradient-text">PDF</span>
              </span>
            )}
          </Link>
        </div>

        {/* User Info */}
        {!collapsed && (
          <div className="p-4 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <span className="text-sm font-bold text-primary">
                  {user.name.charAt(0)}
                </span>
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">{user.name}</p>
                <div className="flex items-center gap-1">
                  {user.plan === "premium" ? (
                    <span className="inline-flex items-center gap-1 text-xs text-accent">
                      <Crown className="w-3 h-3" />
                      Premium
                    </span>
                  ) : (
                    <span className="text-xs text-muted-foreground">Free Plan</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {userNav.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
                title={collapsed ? item.label : undefined}
              >
                <item.icon className="w-5 h-5 shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Upgrade CTA (if free) */}
        {!collapsed && user.plan === "free" && (
          <div className="p-4">
            <div className="gradient-bg rounded-xl p-4 text-white">
              <div className="flex items-center gap-2 mb-2">
                <Crown className="w-4 h-4" />
                <span className="text-sm font-semibold">Go Premium</span>
              </div>
              <p className="text-xs text-white/80 mb-3">
                Unlimited files, no ads, AI tools
              </p>
              <Link
                href="/pricing"
                className="block w-full py-2 bg-white text-primary text-center text-sm font-medium rounded-lg hover:bg-white/90 transition-colors"
              >
                Upgrade Now
              </Link>
            </div>
          </div>
        )}

        {/* Bottom */}
        <div className="p-3 border-t border-border space-y-1">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            title={collapsed ? "Back to Tools" : undefined}
          >
            <FileText className="w-5 h-5 shrink-0" />
            {!collapsed && <span>Back to Tools</span>}
          </Link>
          <button
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-danger hover:bg-danger/10 transition-colors w-full cursor-pointer"
            title={collapsed ? "Sign Out" : undefined}
          >
            <LogOut className="w-5 h-5 shrink-0" />
            {!collapsed && <span>Sign Out</span>}
          </button>
        </div>

        {/* Collapse Toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 w-6 h-6 bg-card border border-border rounded-full flex items-center justify-center hover:bg-muted transition-colors cursor-pointer"
        >
          {collapsed ? (
            <ChevronRight className="w-3 h-3" />
          ) : (
            <ChevronLeft className="w-3 h-3" />
          )}
        </button>
      </aside>

      {/* Main Content */}
      <main
        className={clsx(
          "flex-1 transition-all duration-300",
          collapsed ? "ml-[68px]" : "ml-64"
        )}
      >
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold">
              {userNav.find(
                (n) =>
                  pathname === n.href ||
                  (n.href !== "/dashboard" && pathname.startsWith(n.href))
              )?.label || "Dashboard"}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard/tickets"
              className="p-2 rounded-xl hover:bg-muted transition-colors relative"
            >
              <MessageSquare className="w-5 h-5 text-muted-foreground" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
            </Link>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-sm font-bold text-primary">
                  {user.name.charAt(0)}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
