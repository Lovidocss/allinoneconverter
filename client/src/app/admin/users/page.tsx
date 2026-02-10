"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Search,
  MoreHorizontal,
  Crown,
  Ban,
  CheckCircle,
  AlertCircle,
  Mail,
  Trash2,
  Eye,
  ChevronLeft,
  ChevronRight,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui";
import { getUsers, updateUser, deleteUser, type UserFilters } from "@/lib/admin-api";

interface User {
  _id: string;
  name: string;
  email: string;
  subscription: string;
  status: string;
  createdAt: string;
  lastActive?: string;
  filesProcessed: number;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterPlan, setFilterPlan] = useState<"all" | "free" | "premium">("all");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "suspended" | "banned">("all");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const perPage = 10;

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const filters: UserFilters = {
        search: search || undefined,
        plan: filterPlan,
        status: filterStatus,
        page: currentPage,
        limit: perPage,
      };
      const data = await getUsers(filters);
      setUsers(data.users);
      setTotalUsers(data.total);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  }, [search, filterPlan, filterStatus, currentPage]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const toggleSelectAll = () => {
    if (selectedUsers.length === users.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(users.map((u) => u._id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedUsers((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleUpdateUser = async (userId: string, data: { status?: string; subscription?: string }) => {
    try {
      await updateUser(userId, data);
      fetchUsers();
    } catch (error) {
      console.error("Failed to update user:", error);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      await deleteUser(userId);
      setSelectedUsers((prev) => prev.filter((id) => id !== userId));
      fetchUsers();
    } catch (error) {
      console.error("Failed to delete user:", error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">User Management</h1>
          <p className="text-muted-foreground">
            {totalUsers} users found
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={fetchUsers}>
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            Export CSV
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={filterPlan}
            onChange={(e) => {
              setFilterPlan(e.target.value as "all" | "free" | "premium");
              setCurrentPage(1);
            }}
            className="px-3 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 cursor-pointer"
          >
            <option value="all">All Plans</option>
            <option value="free">Free</option>
            <option value="premium">Premium</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => {
              setFilterStatus(e.target.value as "all" | "active" | "suspended" | "banned");
              setCurrentPage(1);
            }}
            className="px-3 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 cursor-pointer"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
            <option value="banned">Banned</option>
          </select>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedUsers.length > 0 && (
        <div className="flex items-center gap-3 p-3 bg-primary/5 border border-primary/20 rounded-xl">
          <span className="text-sm font-medium">
            {selectedUsers.length} selected
          </span>
          <div className="flex-1" />
          <Button variant="outline" size="sm">
            <Mail className="w-4 h-4" />
            Email
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              selectedUsers.forEach((id) => handleUpdateUser(id, { status: "suspended" }));
              setSelectedUsers([]);
            }}
          >
            <Ban className="w-4 h-4" />
            Suspend
          </Button>
          <Button 
            variant="danger" 
            size="sm"
            onClick={() => {
              if (confirm(`Delete ${selectedUsers.length} users?`)) {
                selectedUsers.forEach((id) => handleDeleteUser(id));
                setSelectedUsers([]);
              }
            }}
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </Button>
        </div>
      )}

      {/* Table */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="p-4 text-left">
                      <input
                        type="checkbox"
                        checked={
                          selectedUsers.length === users.length &&
                          users.length > 0
                        }
                        onChange={toggleSelectAll}
                        className="w-4 h-4 rounded border-border cursor-pointer"
                      />
                    </th>
                    <th className="p-4 text-left text-sm font-semibold">User</th>
                    <th className="p-4 text-left text-sm font-semibold">Plan</th>
                    <th className="p-4 text-left text-sm font-semibold">Status</th>
                    <th className="p-4 text-left text-sm font-semibold">Joined</th>
                    <th className="p-4 text-left text-sm font-semibold">Last Active</th>
                    <th className="p-4 text-left text-sm font-semibold">Files</th>
                    <th className="p-4 text-right text-sm font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="p-8 text-center text-muted-foreground">
                        No users found
                      </td>
                    </tr>
                  ) : (
                    users.map((user) => (
                      <UserRow
                        key={user._id}
                        user={user}
                        selected={selectedUsers.includes(user._id)}
                        onToggleSelect={() => toggleSelect(user._id)}
                        formatDate={formatDate}
                        onUpdate={handleUpdateUser}
                        onDelete={handleDeleteUser}
                      />
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="p-4 border-t border-border flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing {users.length > 0 ? (currentPage - 1) * perPage + 1 : 0} to{" "}
                {Math.min(currentPage * perPage, totalUsers)} of{" "}
                {totalUsers}
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .slice(
                    Math.max(0, currentPage - 3),
                    Math.min(totalPages, currentPage + 2)
                  )
                  .map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-8 h-8 rounded-lg text-sm font-medium cursor-pointer ${
                        currentPage === page
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className="p-2 rounded-lg hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function UserRow({
  user,
  selected,
  onToggleSelect,
  formatDate,
  onUpdate,
  onDelete,
}: {
  user: User;
  selected: boolean;
  onToggleSelect: () => void;
  formatDate: (date: string) => string;
  onUpdate: (userId: string, data: { status?: string; subscription?: string }) => void;
  onDelete: (userId: string) => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <tr className="border-b border-border hover:bg-muted/30 transition-colors">
      <td className="p-4">
        <input
          type="checkbox"
          checked={selected}
          onChange={onToggleSelect}
          className="w-4 h-4 rounded border-border cursor-pointer"
        />
      </td>
      <td className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <span className="text-sm font-bold text-primary">
              {user.name.charAt(0)}
            </span>
          </div>
          <div>
            <p className="text-sm font-medium">{user.name}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
        </div>
      </td>
      <td className="p-4">
        {user.subscription === "premium" ? (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-accent/10 text-accent text-xs font-medium">
            <Crown className="w-3 h-3" />
            Premium
          </span>
        ) : (
          <span className="text-xs text-muted-foreground">Free</span>
        )}
      </td>
      <td className="p-4">
        <span
          className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium ${
            user.status === "active"
              ? "bg-success/10 text-success"
              : user.status === "suspended"
              ? "bg-accent/10 text-accent"
              : "bg-danger/10 text-danger"
          }`}
        >
          {user.status === "active" ? (
            <CheckCircle className="w-3 h-3" />
          ) : user.status === "suspended" ? (
            <AlertCircle className="w-3 h-3" />
          ) : (
            <Ban className="w-3 h-3" />
          )}
          {user.status}
        </span>
      </td>
      <td className="p-4 text-sm text-muted-foreground">{formatDate(user.createdAt)}</td>
      <td className="p-4 text-sm text-muted-foreground">{user.lastActive ? formatDate(user.lastActive) : "Never"}</td>
      <td className="p-4 text-sm">{user.filesProcessed || 0}</td>
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
            <div className="absolute right-4 top-full mt-1 w-40 bg-card border border-border rounded-xl shadow-lg z-50 py-1">
              <button className="w-full px-3 py-2 text-left text-sm hover:bg-muted flex items-center gap-2 cursor-pointer">
                <Eye className="w-4 h-4" />
                View Details
              </button>
              <button className="w-full px-3 py-2 text-left text-sm hover:bg-muted flex items-center gap-2 cursor-pointer">
                <Mail className="w-4 h-4" />
                Send Email
              </button>
              {user.subscription !== "premium" && (
                <button 
                  onClick={() => {
                    onUpdate(user._id, { subscription: "premium" });
                    setMenuOpen(false);
                  }}
                  className="w-full px-3 py-2 text-left text-sm hover:bg-muted flex items-center gap-2 cursor-pointer"
                >
                  <Crown className="w-4 h-4" />
                  Upgrade to Pro
                </button>
              )}
              <hr className="my-1 border-border" />
              {user.status === "active" ? (
                <button 
                  onClick={() => {
                    onUpdate(user._id, { status: "suspended" });
                    setMenuOpen(false);
                  }}
                  className="w-full px-3 py-2 text-left text-sm hover:bg-muted flex items-center gap-2 text-accent cursor-pointer"
                >
                  <Ban className="w-4 h-4" />
                  Suspend
                </button>
              ) : (
                <button 
                  onClick={() => {
                    onUpdate(user._id, { status: "active" });
                    setMenuOpen(false);
                  }}
                  className="w-full px-3 py-2 text-left text-sm hover:bg-muted flex items-center gap-2 text-success cursor-pointer"
                >
                  <CheckCircle className="w-4 h-4" />
                  Activate
                </button>
              )}
              <button 
                onClick={() => {
                  onDelete(user._id);
                  setMenuOpen(false);
                }}
                className="w-full px-3 py-2 text-left text-sm hover:bg-muted flex items-center gap-2 text-danger cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          </>
        )}
      </td>
    </tr>
  );
}
