"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  FileText,
  Download,
  Trash2,
  Clock,
  Calendar,
  Loader2,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui";
import { useAuth } from "@/hooks/useAuth";
import { useFileHistory, formatFileSize, formatRelativeTime } from "@/hooks/useFileHistory";

export default function HistoryPage() {
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  const { 
    history, 
    pagination, 
    loading, 
    error, 
    fetchHistory, 
    deleteHistoryEntry,
    refreshHistory 
  } = useFileHistory();
  
  const [search, setSearch] = useState("");
  const [filterTool, setFilterTool] = useState("all");
  const [deleting, setDeleting] = useState<string | null>(null);

  // Redirect if not logged in
  useEffect(() => {
    if (typeof window !== "undefined" && !isLoggedIn) {
      router.push("/auth/signin");
    }
  }, [isLoggedIn, router]);

  // Get unique tools from history
  const tools = [...new Set(history.map((f) => f.toolName))];

  // Filter files locally
  const filteredFiles = history.filter((file) => {
    const matchesSearch =
      file.fileName.toLowerCase().includes(search.toLowerCase()) ||
      file.originalName.toLowerCase().includes(search.toLowerCase());
    const matchesTool = filterTool === "all" || file.toolName === filterTool;
    return matchesSearch && matchesTool;
  });

  const completedFiles = history.filter((f) => f.status === "completed").length;
  const processingFiles = history.filter((f) => f.status === "processing").length;
  const failedFiles = history.filter((f) => f.status === "failed").length;

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this file?")) return;
    
    setDeleting(id);
    await deleteHistoryEntry(id);
    setDeleting(null);
  };

  const handleToolFilter = (tool: string) => {
    setFilterTool(tool);
    fetchHistory(1, tool === "all" ? undefined : tool);
  };

  const handleLoadMore = () => {
    if (pagination && pagination.page < pagination.pages) {
      fetchHistory(pagination.page + 1, filterTool === "all" ? undefined : filterTool);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "processing":
        return <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />;
      case "failed":
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-green-500/10 text-green-600">
            Completed
          </span>
        );
      case "processing":
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-blue-500/10 text-blue-600">
            Processing
          </span>
        );
      case "failed":
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-red-500/10 text-red-600">
            Failed
          </span>
        );
      default:
        return null;
    }
  };

  if (!isLoggedIn) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">File History</h1>
          <p className="text-muted-foreground">
            {completedFiles} completed · {processingFiles} processing · {failedFiles} failed
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={refreshHistory}
          disabled={loading}
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Info Banner */}
      <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex items-start gap-3">
        <Clock className="w-5 h-5 text-primary shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium">Files auto-delete after 24 hours</p>
          <p className="text-xs text-muted-foreground mt-1">
            For security reasons, processed files are automatically removed. Download
            your files before they expire.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search files..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
        <select
          value={filterTool}
          onChange={(e) => handleToolFilter(e.target.value)}
          className="px-3 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 cursor-pointer"
        >
          <option value="all">All Tools</option>
          {tools.map((tool) => (
            <option key={tool} value={tool}>
              {tool}
            </option>
          ))}
        </select>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-600">
          <p className="text-sm font-medium">Error loading history</p>
          <p className="text-xs mt-1">{error}</p>
        </div>
      )}

      {/* Loading State */}
      {loading && history.length === 0 && (
        <div className="bg-card border border-border rounded-2xl p-12 text-center">
          <Loader2 className="w-12 h-12 mx-auto text-primary animate-spin mb-3" />
          <p className="text-muted-foreground">Loading your files...</p>
        </div>
      )}

      {/* Files List */}
      {!loading || history.length > 0 ? (
        <div className="space-y-3">
          {filteredFiles.length === 0 ? (
            <div className="bg-card border border-border rounded-2xl p-12 text-center">
              <FileText className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
              <p className="text-muted-foreground">No files found</p>
              <p className="text-sm text-muted-foreground mt-1">
                Process some files to see them here
              </p>
            </div>
          ) : (
            filteredFiles.map((file) => (
              <div
                key={file._id}
                className={`bg-card border rounded-2xl p-4 flex items-center gap-4 ${
                  file.status === "failed"
                    ? "border-red-500/30"
                    : "border-border"
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                    file.status === "completed"
                      ? "bg-green-500/10"
                      : file.status === "processing"
                      ? "bg-blue-500/10"
                      : "bg-red-500/10"
                  }`}
                >
                  {getStatusIcon(file.status)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium truncate">{file.fileName}</p>
                    {getStatusBadge(file.status)}
                  </div>
                  <p className="text-xs text-muted-foreground truncate">
                    {file.originalName}
                  </p>
                  <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                    <span>{file.toolName}</span>
                    <span>·</span>
                    <span>{formatFileSize(file.fileSize)}</span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatRelativeTime(file.createdAt)}
                    </span>
                    {file.processingTime && (
                      <>
                        <span>·</span>
                        <span>{(file.processingTime / 1000).toFixed(1)}s</span>
                      </>
                    )}
                  </div>
                  {file.status === "failed" && file.errorMessage && (
                    <p className="text-xs text-red-500 mt-1">{file.errorMessage}</p>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {file.status === "completed" && file.resultUrl ? (
                    <>
                      <a
                        href={file.resultUrl}
                        download
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-background text-sm hover:bg-muted transition-colors"
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </a>
                      <button
                        onClick={() => handleDelete(file._id)}
                        disabled={deleting === file._id}
                        className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-red-500 cursor-pointer disabled:opacity-50"
                      >
                        {deleting === file._id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </>
                  ) : file.status === "processing" ? (
                    <span className="text-xs text-blue-500 flex items-center gap-1">
                      <Loader2 className="w-3 h-3 animate-spin" />
                      Processing...
                    </span>
                  ) : (
                    <button
                      onClick={() => handleDelete(file._id)}
                      disabled={deleting === file._id}
                      className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-red-500 cursor-pointer disabled:opacity-50"
                    >
                      {deleting === file._id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      ) : null}

      {/* Load More */}
      {pagination && pagination.page < pagination.pages && (
        <div className="text-center">
          <Button variant="outline" onClick={handleLoadMore} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Loading...
              </>
            ) : (
              `Load More (${pagination.total - history.length} remaining)`
            )}
          </Button>
        </div>
      )}

      {/* Pagination Info */}
      {pagination && pagination.total > 0 && (
        <p className="text-center text-xs text-muted-foreground">
          Showing {filteredFiles.length} of {pagination.total} files
        </p>
      )}
    </div>
  );
}
