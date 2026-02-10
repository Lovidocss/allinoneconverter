"use client";

import { useLayoutEffect, useState, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Shield, LogOut } from "lucide-react";

interface AdminAuthGuardProps {
  children: React.ReactNode;
}

export function AdminAuthGuard({ children }: AdminAuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";
  
  const [authState, setAuthState] = useState<"loading" | "authenticated" | "unauthenticated">("loading");
  const hasChecked = useRef(false);

  useLayoutEffect(() => {
    if (hasChecked.current) return;
    hasChecked.current = true;
    
    if (isLoginPage) {
      setAuthState("authenticated");
      return;
    }
    
    const token = localStorage.getItem("adminToken");
    if (!token) {
      setAuthState("unauthenticated");
      router.replace("/admin/login");
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const isExpired = payload.exp * 1000 < Date.now();
      
      if (isExpired || payload.role !== "admin") {
        localStorage.removeItem("adminToken");
        setAuthState("unauthenticated");
        router.replace("/admin/login");
        return;
      }
      setAuthState("authenticated");
    } catch {
      localStorage.removeItem("adminToken");
      setAuthState("unauthenticated");
      router.replace("/admin/login");
    }
  }, [isLoginPage, router]);

  // Login page doesn't need auth check
  if (isLoginPage) {
    return <>{children}</>;
  }

  if (authState === "loading") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 gradient-bg rounded-xl flex items-center justify-center">
            <Shield className="w-6 h-6 text-white animate-pulse" />
          </div>
          <p className="text-muted-foreground">Verifying access...</p>
        </div>
      </div>
    );
  }

  if (authState === "unauthenticated") {
    return null;
  }

  return <>{children}</>;
}

export function handleAdminLogout() {
  localStorage.removeItem("adminToken");
  window.location.href = "/admin/login";
}

export function LogoutButton({ collapsed }: { collapsed: boolean }) {
  return (
    <button
      onClick={handleAdminLogout}
      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-danger hover:bg-danger/10 transition-colors w-full cursor-pointer"
      title={collapsed ? "Sign Out" : undefined}
    >
      <LogOut className="w-5 h-5 shrink-0" />
      {!collapsed && <span>Sign Out</span>}
    </button>
  );
}
