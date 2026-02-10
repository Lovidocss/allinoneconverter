"use client";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// Helper function to get auth token
function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("adminToken");
}

// Helper function for API requests
async function adminFetch(endpoint: string, options: RequestInit = {}) {
  const token = getToken();
  
  const response = await fetch(`${API_URL}/api/admin${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Request failed" }));
    throw new Error(error.message || "Request failed");
  }

  return response.json();
}

// ─── Stats & Overview ───
export async function getAdminStats() {
  return adminFetch("/stats");
}

export async function getAdminActivity(days = 7) {
  return adminFetch(`/activity?days=${days}`);
}

export async function getRecentUsers(limit = 5) {
  return adminFetch(`/recent-users?limit=${limit}`);
}

export async function getRecentTickets(limit = 5) {
  return adminFetch(`/recent-tickets?limit=${limit}`);
}

// ─── Users ───
export interface UserFilters {
  search?: string;
  plan?: "all" | "free" | "premium";
  status?: "all" | "active" | "suspended" | "banned";
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export async function getUsers(filters: UserFilters = {}) {
  const params = new URLSearchParams();
  if (filters.search) params.set("search", filters.search);
  if (filters.plan && filters.plan !== "all") params.set("plan", filters.plan);
  if (filters.status && filters.status !== "all") params.set("status", filters.status);
  if (filters.page) params.set("page", String(filters.page));
  if (filters.limit) params.set("limit", String(filters.limit));
  if (filters.sortBy) params.set("sortBy", filters.sortBy);
  if (filters.sortOrder) params.set("sortOrder", filters.sortOrder);
  
  return adminFetch(`/users?${params.toString()}`);
}

export async function updateUser(userId: string, data: {
  name?: string;
  status?: string;
  subscription?: string;
  role?: string;
}) {
  return adminFetch(`/users/${userId}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function deleteUser(userId: string) {
  return adminFetch(`/users/${userId}`, {
    method: "DELETE",
  });
}

export async function createUser(data: {
  email: string;
  name: string;
  password?: string;
  subscription?: string;
  role?: string;
}) {
  return adminFetch("/users", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// ─── Tickets ───
export interface TicketFilters {
  status?: string;
  priority?: string;
  category?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export async function getTickets(filters: TicketFilters = {}) {
  const params = new URLSearchParams();
  if (filters.status) params.set("status", filters.status);
  if (filters.priority) params.set("priority", filters.priority);
  if (filters.category) params.set("category", filters.category);
  if (filters.search) params.set("search", filters.search);
  if (filters.page) params.set("page", String(filters.page));
  if (filters.limit) params.set("limit", String(filters.limit));
  
  return adminFetch(`/tickets?${params.toString()}`);
}

export async function getTicket(ticketId: string) {
  return adminFetch(`/tickets/${ticketId}`);
}

export async function updateTicket(ticketId: string, data: {
  status?: string;
  priority?: string;
  reply?: string;
}) {
  return adminFetch(`/tickets/${ticketId}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function deleteTicket(ticketId: string) {
  return adminFetch(`/tickets/${ticketId}`, {
    method: "DELETE",
  });
}

// ─── Subscriptions ───
export interface SubscriptionFilters {
  status?: string;
  plan?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export async function getSubscriptions(filters: SubscriptionFilters = {}) {
  const params = new URLSearchParams();
  if (filters.status) params.set("status", filters.status);
  if (filters.plan) params.set("plan", filters.plan);
  if (filters.search) params.set("search", filters.search);
  if (filters.page) params.set("page", String(filters.page));
  if (filters.limit) params.set("limit", String(filters.limit));
  
  return adminFetch(`/subscriptions?${params.toString()}`);
}

// ─── Analytics ───
export async function getAnalytics(days = 30) {
  return adminFetch(`/analytics?days=${days}`);
}

// ─── Settings ───
export async function getSettings() {
  return adminFetch("/settings");
}

export async function updateSettings(settings: Record<string, unknown>) {
  return adminFetch("/settings", {
    method: "PUT",
    body: JSON.stringify(settings),
  });
}
