"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Search,
  MessageSquare,
  Clock,
  CheckCircle,
  AlertCircle,
  Send,
  ChevronDown,
  ChevronUp,
  User,
  Shield,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui";
import { getTickets, updateTicket, type TicketFilters } from "@/lib/admin-api";

interface TicketReply {
  _id: string;
  message: string;
  author: string;
  isAdmin: boolean;
  createdAt: string;
}

interface Ticket {
  _id: string;
  subject: string;
  message: string;
  category: "bug" | "billing" | "feature" | "complaint" | "general";
  status: "open" | "in-progress" | "resolved" | "closed";
  priority: "low" | "medium" | "high" | "urgent";
  userName: string;
  userEmail: string;
  createdAt: string;
  replies: TicketReply[];
}

export default function AdminTicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState<"all" | Ticket["category"]>("all");
  const [filterStatus, setFilterStatus] = useState<"all" | Ticket["status"]>("all");
  const [filterPriority, setFilterPriority] = useState<"all" | Ticket["priority"]>("all");
  const [expandedTicket, setExpandedTicket] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [stats, setStats] = useState({ open: 0, inProgress: 0, urgent: 0, resolved: 0 });

  const fetchTickets = useCallback(async () => {
    try {
      setLoading(true);
      const filters: TicketFilters = {
        search: search || undefined,
        category: filterCategory !== "all" ? filterCategory : undefined,
        status: filterStatus !== "all" ? filterStatus : undefined,
        priority: filterPriority !== "all" ? filterPriority : undefined,
      };
      const data = await getTickets(filters);
      setTickets(data.tickets);
      setStats({
        open: data.stats?.open || 0,
        inProgress: data.stats?.inProgress || 0,
        urgent: data.stats?.urgent || 0,
        resolved: data.stats?.resolved || 0,
      });
    } catch (error) {
      console.error("Failed to fetch tickets:", error);
    } finally {
      setLoading(false);
    }
  }, [search, filterCategory, filterStatus, filterPriority]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchTickets();
    }, 300);
    return () => clearTimeout(timer);
  }, [search, fetchTickets]);

  const handleSendReply = async (ticketId: string) => {
    if (!replyText.trim()) return;
    try {
      await updateTicket(ticketId, { reply: replyText });
      setReplyText("");
      fetchTickets();
    } catch (error) {
      console.error("Failed to send reply:", error);
    }
  };

  const handleStatusChange = async (ticketId: string, status: string) => {
    try {
      await updateTicket(ticketId, { status });
      fetchTickets();
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Support Tickets</h1>
          <p className="text-muted-foreground">
            Manage customer complaints and support requests
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchTickets}>
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
            <MessageSquare className="w-5 h-5 text-accent" />
          </div>
          <div>
            <p className="text-xl font-bold">{stats.open}</p>
            <p className="text-xs text-muted-foreground">Open</p>
          </div>
        </div>
        <div className="bg-card border border-border rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Clock className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-xl font-bold">{stats.inProgress}</p>
            <p className="text-xs text-muted-foreground">In Progress</p>
          </div>
        </div>
        <div className="bg-card border border-border rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-danger/10 flex items-center justify-center">
            <AlertCircle className="w-5 h-5 text-danger" />
          </div>
          <div>
            <p className="text-xl font-bold">{stats.urgent}</p>
            <p className="text-xs text-muted-foreground">Urgent</p>
          </div>
        </div>
        <div className="bg-card border border-border rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
            <CheckCircle className="w-5 h-5 text-success" />
          </div>
          <div>
            <p className="text-xl font-bold">{stats.resolved}</p>
            <p className="text-xs text-muted-foreground">Resolved</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search tickets..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value as "all" | Ticket["category"])}
            className="px-3 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none cursor-pointer"
          >
            <option value="all">All Categories</option>
            <option value="bug">Bug</option>
            <option value="billing">Billing</option>
            <option value="feature">Feature Request</option>
            <option value="complaint">Complaint</option>
            <option value="general">General</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as "all" | Ticket["status"])}
            className="px-3 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none cursor-pointer"
          >
            <option value="all">All Status</option>
            <option value="open">Open</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value as "all" | Ticket["priority"])}
            className="px-3 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none cursor-pointer"
          >
            <option value="all">All Priority</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      {/* Tickets List */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="space-y-4">
          {tickets.map((ticket) => (
            <div
              key={ticket._id}
              className="bg-card border border-border rounded-2xl overflow-hidden"
            >
              {/* Ticket Header */}
              <button
                onClick={() =>
                  setExpandedTicket(expandedTicket === ticket._id ? null : ticket._id)
                }
                className="w-full p-4 flex items-start gap-4 text-left hover:bg-muted/30 transition-colors cursor-pointer"
              >
                {/* Priority Indicator */}
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

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-sm">{ticket.subject}</h3>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                        ticket.category === "bug"
                          ? "bg-danger/10 text-danger"
                          : ticket.category === "billing"
                          ? "bg-accent/10 text-accent"
                          : ticket.category === "feature"
                          ? "bg-primary/10 text-primary"
                          : ticket.category === "complaint"
                          ? "bg-danger/10 text-danger"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {ticket.category}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                        ticket.status === "open"
                          ? "bg-accent/10 text-accent"
                          : ticket.status === "in-progress"
                          ? "bg-primary/10 text-primary"
                          : ticket.status === "resolved"
                          ? "bg-success/10 text-success"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {ticket.status}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {ticket.userName} ({ticket.userEmail}) ·{" "}
                    {new Date(ticket.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                    {ticket.message}
                  </p>
                </div>

                {/* Expand Icon */}
                <div className="shrink-0">
                  {expandedTicket === ticket._id ? (
                    <ChevronUp className="w-5 h-5 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-muted-foreground" />
                  )}
                </div>
              </button>

              {/* Expanded Content */}
              {expandedTicket === ticket._id && (
                <div className="border-t border-border">
                  {/* Full Message */}
                  <div className="p-4 bg-muted/30">
                    <p className="text-sm">{ticket.message}</p>
                  </div>

                  {/* Replies */}
                  {ticket.replies && ticket.replies.length > 0 && (
                    <div className="px-4 py-2 space-y-3">
                      {ticket.replies.map((reply) => (
                        <div
                          key={reply._id}
                          className={`flex gap-3 ${
                            reply.isAdmin ? "" : "flex-row-reverse"
                          }`}
                        >
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                              reply.isAdmin
                                ? "bg-primary/10"
                                : "bg-muted"
                            }`}
                          >
                            {reply.isAdmin ? (
                              <Shield className="w-4 h-4 text-primary" />
                            ) : (
                              <User className="w-4 h-4 text-muted-foreground" />
                            )}
                          </div>
                          <div
                            className={`flex-1 max-w-[80%] ${
                              reply.isAdmin ? "" : "text-right"
                            }`}
                          >
                            <div
                              className={`inline-block p-3 rounded-xl text-sm ${
                                reply.isAdmin
                                  ? "bg-primary/10 text-foreground"
                                  : "bg-muted text-foreground"
                              }`}
                            >
                              {reply.message}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                              {reply.author} ·{" "}
                              {new Date(reply.createdAt).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Reply Input */}
                  <div className="p-4 border-t border-border flex gap-3">
                    <input
                      type="text"
                      placeholder="Type your reply..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      className="flex-1 px-4 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSendReply(ticket._id);
                      }}
                    />
                    <Button onClick={() => handleSendReply(ticket._id)} size="sm">
                      <Send className="w-4 h-4" />
                      Reply
                    </Button>
                  </div>

                  {/* Action Bar */}
                  <div className="p-4 border-t border-border bg-muted/30 flex items-center gap-2 flex-wrap">
                    <span className="text-xs text-muted-foreground">Change status:</span>
                    <button 
                      onClick={() => handleStatusChange(ticket._id, "open")}
                      className={`px-2 py-1 text-xs rounded-lg cursor-pointer ${
                        ticket.status === "open" 
                          ? "bg-accent text-white" 
                          : "bg-accent/10 text-accent hover:bg-accent/20"
                      }`}
                    >
                      Open
                    </button>
                    <button 
                      onClick={() => handleStatusChange(ticket._id, "in-progress")}
                      className={`px-2 py-1 text-xs rounded-lg cursor-pointer ${
                        ticket.status === "in-progress" 
                          ? "bg-primary text-white" 
                          : "bg-primary/10 text-primary hover:bg-primary/20"
                      }`}
                    >
                      In Progress
                    </button>
                    <button 
                      onClick={() => handleStatusChange(ticket._id, "resolved")}
                      className={`px-2 py-1 text-xs rounded-lg cursor-pointer ${
                        ticket.status === "resolved" 
                          ? "bg-success text-white" 
                          : "bg-success/10 text-success hover:bg-success/20"
                      }`}
                    >
                      Resolved
                    </button>
                    <button 
                      onClick={() => handleStatusChange(ticket._id, "closed")}
                      className={`px-2 py-1 text-xs rounded-lg cursor-pointer ${
                        ticket.status === "closed" 
                          ? "bg-muted-foreground text-white" 
                          : "bg-muted text-muted-foreground hover:bg-border"
                      }`}
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}

          {tickets.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No tickets found matching your filters</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
