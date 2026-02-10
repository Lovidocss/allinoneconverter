"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";
import {
  LayoutDashboard,
  Users,
  CreditCard,
  MessageSquare,
  Settings,
  FileText,
  ChevronLeft,
  ChevronRight,
  Shield,
  BarChart3,
} from "lucide-react";
import { AdminAuthGuard, LogoutButton } from "@/components/AdminAuthGuard";

const adminNav = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/subscriptions", label: "Subscriptions", icon: CreditCard },
  { href: "/admin/tickets", label: "Tickets", icon: MessageSquare },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  // Don't show sidebar for login page
  if (pathname === "/admin/login") {
    return <AdminAuthGuard>{children}</AdminAuthGuard>;
  }

  return (
    <AdminAuthGuard>
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
            <div className="w-9 h-9 gradient-bg rounded-xl flex items-center justify-center shrink-0">
              <Shield className="w-5 h-5 text-white" />
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <p className="text-sm font-bold truncate">Admin Panel</p>
                <p className="text-xs text-muted-foreground">🫶iDocs</p>
              </div>
            )}
          </div>

          {/* Nav */}
          <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
            {adminNav.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/admin" && pathname.startsWith(item.href));
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

          {/* Bottom */}
          <div className="p-3 border-t border-border space-y-1">
            <Link
              href="/"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              title={collapsed ? "Back to Site" : undefined}
            >
              <FileText className="w-5 h-5 shrink-0" />
              {!collapsed && <span>Back to Site</span>}
            </Link>
            <LogoutButton collapsed={collapsed} />
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
              {adminNav.find(
                (n) =>
                  pathname === n.href ||
                  (n.href !== "/admin" && pathname.startsWith(n.href))
              )?.label || "Admin"}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-medium">Admin User</p>
              <p className="text-xs text-muted-foreground">admin@idocs.app</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-sm font-bold text-primary">A</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-6">{children}</div>
      </main>
    </div>
    </AdminAuthGuard>
  );
}
