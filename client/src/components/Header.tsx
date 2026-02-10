"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";
import {
  Menu,
  X,
  Search,
  ChevronDown,
  FileText,
  User,
  Crown,
  Star,
  TrendingUp,
  LayoutGrid,
  LogOut,
  Settings,
  History,
} from "lucide-react";
import { categories, getToolsByCategory, getFeaturedTools, getPopularTools } from "@/lib/tools-data";
import { Button } from "@/components/ui";
import { useAuth } from "@/hooks/useAuth";

type NavDropdown = "featured" | "popular" | "all" | "user" | null;

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeDropdown, setActiveDropdown] = useState<NavDropdown>(null);
  const pathname = usePathname();
  
  const { user, isLoggedIn, isPremium, logout, loading } = useAuth();

  const featuredTools = getFeaturedTools();
  const popularTools = getPopularTools();

  return (
    <header className="sticky top-0 z-50 glass border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <div className="w-9 h-9 bg-foreground rounded-xl flex items-center justify-center">
              <span className="text-lg">🫶</span>
            </div>
            <span className="text-lg font-bold hidden sm:block">
              i<span className="text-muted-foreground">Docs</span>
            </span>
          </Link>

          {/* Desktop Nav - 3 main categories */}
          <nav className="hidden lg:flex items-center gap-1">
            {/* Featured PDF Tools */}
            <div
              className="relative"
              onMouseEnter={() => setActiveDropdown("featured")}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button
                className={clsx(
                  "flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer",
                  activeDropdown === "featured"
                    ? "text-foreground bg-muted"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                <Star className="w-4 h-4" />
                Featured Tools
                <ChevronDown
                  className={clsx(
                    "w-3.5 h-3.5 transition-transform",
                    activeDropdown === "featured" && "rotate-180"
                  )}
                />
              </button>

              {activeDropdown === "featured" && (
                <div className="absolute top-full left-0 mt-1 w-72 bg-card border border-border rounded-xl shadow-lg p-3 z-50">
                  <div className="space-y-0.5">
                    {featuredTools.map((tool) => (
                      <Link
                        key={tool.slug}
                        href={`/tool/${tool.slug}`}
                        className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                      >
                        <span>{tool.name}</span>
                        {tool.premium && (
                          <Crown className="w-3.5 h-3.5 text-amber-500" />
                        )}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Popular PDF Tools */}
            <div
              className="relative"
              onMouseEnter={() => setActiveDropdown("popular")}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button
                className={clsx(
                  "flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer",
                  activeDropdown === "popular"
                    ? "text-foreground bg-muted"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                <TrendingUp className="w-4 h-4" />
                Popular Tools
                <ChevronDown
                  className={clsx(
                    "w-3.5 h-3.5 transition-transform",
                    activeDropdown === "popular" && "rotate-180"
                  )}
                />
              </button>

              {activeDropdown === "popular" && (
                <div className="absolute top-full left-0 mt-1 w-72 bg-card border border-border rounded-xl shadow-lg p-3 z-50">
                  <div className="space-y-0.5">
                    {popularTools.map((tool) => (
                      <Link
                        key={tool.slug}
                        href={`/tool/${tool.slug}`}
                        className="flex items-center px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                      >
                        {tool.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* All Tools */}
            <div
              className="relative"
              onMouseEnter={() => setActiveDropdown("all")}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button
                className={clsx(
                  "flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer",
                  activeDropdown === "all"
                    ? "text-foreground bg-muted"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                <LayoutGrid className="w-4 h-4" />
                All Tools
                <ChevronDown
                  className={clsx(
                    "w-3.5 h-3.5 transition-transform",
                    activeDropdown === "all" && "rotate-180"
                  )}
                />
              </button>

              {activeDropdown === "all" && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-[700px] bg-card border border-border rounded-2xl shadow-lg p-6 z-50">
                  <div className="grid grid-cols-3 gap-6 max-h-[60vh] overflow-y-auto">
                    {categories.map((cat) => (
                      <div key={cat.slug}>
                        <Link
                          href={`/tools/${cat.slug}`}
                          className="text-sm font-semibold text-foreground hover:underline"
                        >
                          {cat.label}
                        </Link>
                        <div className="mt-2 space-y-1">
                          {getToolsByCategory(cat.slug)
                            .slice(0, 5)
                            .map((tool) => (
                              <Link
                                key={tool.slug}
                                href={`/tool/${tool.slug}`}
                                className="block text-xs text-muted-foreground hover:text-foreground transition-colors py-0.5"
                              >
                                {tool.name}
                              </Link>
                            ))}
                          {getToolsByCategory(cat.slug).length > 5 && (
                            <Link
                              href={`/tools/${cat.slug}`}
                              className="block text-xs text-foreground font-medium py-0.5"
                            >
                              View all →
                            </Link>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Link
              href="/pricing"
              className={clsx(
                "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                pathname === "/pricing"
                  ? "text-foreground bg-muted"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              Pricing
            </Link>
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 rounded-xl hover:bg-muted transition-colors cursor-pointer"
              aria-label="Search"
            >
              <Search className="w-5 h-5 text-muted-foreground" />
            </button>

            {/* Upgrade button - hide if premium or loading */}
            {!loading && !isPremium && (
              <Link href="/pricing" className="hidden sm:block">
                <Button variant="outline" size="sm">
                  <Crown className="w-4 h-4" />
                  Upgrade
                </Button>
              </Link>
            )}

            {/* User section */}
            {loading ? (
              <div className="w-20 h-9 bg-muted rounded-lg animate-pulse" />
            ) : isLoggedIn && user ? (
              <div
                className="relative"
                onMouseEnter={() => setActiveDropdown("user")}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted transition-colors cursor-pointer">
                  <div className="w-8 h-8 bg-foreground rounded-full flex items-center justify-center">
                    <span className="text-background text-sm font-medium">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="hidden sm:block text-sm font-medium max-w-24 truncate">
                    {user.name}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
                </button>

                {activeDropdown === "user" && (
                  <div className="absolute top-full right-0 mt-1 w-56 bg-card border border-border rounded-xl shadow-lg p-2 z-50">
                    <div className="px-3 py-2 border-b border-border mb-2">
                      <p className="font-medium text-sm truncate">{user.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                      {isPremium && (
                        <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 text-xs font-medium rounded-full">
                          <Crown className="w-3 h-3" />
                          Premium
                        </span>
                      )}
                    </div>
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-muted transition-colors"
                    >
                      <LayoutGrid className="w-4 h-4 text-muted-foreground" />
                      Dashboard
                    </Link>
                    <Link
                      href="/dashboard/history"
                      className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-muted transition-colors"
                    >
                      <History className="w-4 h-4 text-muted-foreground" />
                      History
                    </Link>
                    <Link
                      href="/dashboard/settings"
                      className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-muted transition-colors"
                    >
                      <Settings className="w-4 h-4 text-muted-foreground" />
                      Settings
                    </Link>
                    {!isPremium && (
                      <Link
                        href="/pricing"
                        className="flex items-center gap-2 px-3 py-2 text-sm text-amber-600 dark:text-amber-400 rounded-lg hover:bg-muted transition-colors"
                      >
                        <Crown className="w-4 h-4" />
                        Upgrade to Pro
                      </Link>
                    )}
                    <div className="border-t border-border mt-2 pt-2">
                      <button
                        onClick={logout}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-red-500 rounded-lg hover:bg-muted transition-colors w-full cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/auth/signin">
                <Button size="sm">
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">Sign In</span>
                </Button>
              </Link>
            )}

            {/* Mobile toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-xl hover:bg-muted transition-colors cursor-pointer"
            >
              {mobileOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Search overlay */}
        {searchOpen && (
          <div className="pb-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search PDF tools..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-foreground/20 text-sm"
                autoFocus
              />
            </div>
          </div>
        )}
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-border bg-card">
          <div className="max-w-7xl mx-auto px-4 py-4 space-y-4">
            {/* Featured */}
            <div>
              <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Featured Tools</p>
              <div className="space-y-0.5">
                {featuredTools.slice(0, 5).map((tool) => (
                  <Link
                    key={tool.slug}
                    href={`/tool/${tool.slug}`}
                    className="block px-3 py-2 rounded-lg text-sm hover:bg-muted"
                    onClick={() => setMobileOpen(false)}
                  >
                    {tool.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Popular */}
            <div>
              <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Popular Tools</p>
              <div className="space-y-0.5">
                {popularTools.slice(0, 5).map((tool) => (
                  <Link
                    key={tool.slug}
                    href={`/tool/${tool.slug}`}
                    className="block px-3 py-2 rounded-lg text-sm hover:bg-muted"
                    onClick={() => setMobileOpen(false)}
                  >
                    {tool.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Categories */}
            <div>
              <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">All Categories</p>
              <div className="space-y-0.5">
                {categories.map((cat) => (
                  <Link
                    key={cat.slug}
                    href={`/tools/${cat.slug}`}
                    className="block px-3 py-2 rounded-lg text-sm hover:bg-muted"
                    onClick={() => setMobileOpen(false)}
                  >
                    {cat.label}
                  </Link>
                ))}
              </div>
            </div>

            <Link
              href="/pricing"
              className="block px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-muted"
              onClick={() => setMobileOpen(false)}
            >
              Pricing
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
