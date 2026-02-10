"use client";

import { useState, useEffect, useCallback } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export interface FileHistoryItem {
  _id: string;
  userId: string;
  fileName: string;
  originalName: string;
  fileSize: number;
  fileType: string;
  toolUsed: string;
  toolName: string;
  status: "processing" | "completed" | "failed";
  resultUrl?: string;
  errorMessage?: string;
  processingTime?: number;
  createdAt: string;
  updatedAt: string;
}

export interface FileHistoryStats {
  totalFiles: number;
  todayFiles: number;
  totalStorageBytes: number;
  topTools: Array<{
    _id: string;
    count: number;
    toolName: string;
  }>;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

interface UseFileHistoryReturn {
  history: FileHistoryItem[];
  pagination: Pagination | null;
  stats: FileHistoryStats | null;
  loading: boolean;
  error: string | null;
  fetchHistory: (page?: number, toolUsed?: string) => Promise<void>;
  fetchStats: () => Promise<void>;
  createHistoryEntry: (data: CreateHistoryData) => Promise<FileHistoryItem | null>;
  updateHistoryEntry: (id: string, data: UpdateHistoryData) => Promise<FileHistoryItem | null>;
  deleteHistoryEntry: (id: string) => Promise<boolean>;
  refreshHistory: () => Promise<void>;
}

interface CreateHistoryData {
  fileName: string;
  originalName: string;
  fileSize: number;
  fileType: string;
  toolUsed: string;
  toolName: string;
}

interface UpdateHistoryData {
  status?: "processing" | "completed" | "failed";
  resultUrl?: string;
  errorMessage?: string;
  processingTime?: number;
}

export function useFileHistory(): UseFileHistoryReturn {
  const [history, setHistory] = useState<FileHistoryItem[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [stats, setStats] = useState<FileHistoryStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getToken = () => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("userToken");
  };

  const fetchHistory = useCallback(async (page = 1, toolUsed?: string) => {
    const token = getToken();
    if (!token) {
      setError("Not authenticated");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({ page: String(page), limit: "10" });
      if (toolUsed && toolUsed !== "all") {
        params.set("toolUsed", toolUsed);
      }

      const response = await fetch(`${API_URL}/api/history?${params}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch history");
      }

      const data = await response.json();
      setHistory(data.history);
      setPagination(data.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStats = useCallback(async () => {
    const token = getToken();
    if (!token) return;

    try {
      const response = await fetch(`${API_URL}/api/history/stats/summary`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    }
  }, []);

  const createHistoryEntry = useCallback(async (data: CreateHistoryData): Promise<FileHistoryItem | null> => {
    const token = getToken();
    if (!token) return null;

    try {
      const response = await fetch(`${API_URL}/api/history`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to create history entry");
      }

      const entry = await response.json();
      // Prepend to history
      setHistory(prev => [entry, ...prev]);
      return entry;
    } catch (err) {
      console.error("Failed to create history entry:", err);
      return null;
    }
  }, []);

  const updateHistoryEntry = useCallback(async (id: string, data: UpdateHistoryData): Promise<FileHistoryItem | null> => {
    const token = getToken();
    if (!token) return null;

    try {
      const response = await fetch(`${API_URL}/api/history/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to update history entry");
      }

      const entry = await response.json();
      // Update in history
      setHistory(prev => prev.map(item => item._id === id ? entry : item));
      return entry;
    } catch (err) {
      console.error("Failed to update history entry:", err);
      return null;
    }
  }, []);

  const deleteHistoryEntry = useCallback(async (id: string): Promise<boolean> => {
    const token = getToken();
    if (!token) return false;

    try {
      const response = await fetch(`${API_URL}/api/history/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete history entry");
      }

      // Remove from history
      setHistory(prev => prev.filter(item => item._id !== id));
      return true;
    } catch (err) {
      console.error("Failed to delete history entry:", err);
      return false;
    }
  }, []);

  const refreshHistory = useCallback(async () => {
    await Promise.all([fetchHistory(), fetchStats()]);
  }, [fetchHistory, fetchStats]);

  // Initial fetch
  useEffect(() => {
    const token = getToken();
    if (token) {
      fetchHistory();
      fetchStats();
    }
  }, [fetchHistory, fetchStats]);

  return {
    history,
    pagination,
    stats,
    loading,
    error,
    fetchHistory,
    fetchStats,
    createHistoryEntry,
    updateHistoryEntry,
    deleteHistoryEntry,
    refreshHistory,
  };
}

// Helper function to format file size
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

// Helper function to format relative time
export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours} hours ago`;
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString();
}
