"use client";

import { useState } from "react";
import {
  Plus,
  MessageSquare,
  Clock,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Send,
  User,
  Shield,
} from "lucide-react";
import { Button, Input } from "@/components/ui";

interface UserTicket {
  id: string;
  subject: string;
  message: string;
  category: string;
  status: "open" | "in-progress" | "resolved" | "closed";
  createdAt: string;
  replies: {
    id: string;
    author: string;
    isAdmin: boolean;
    message: string;
    createdAt: string;
  }[];
}

export default function UserTicketsPage() {
  const [showNewTicket, setShowNewTicket] = useState(false);
  const [expandedTicket, setExpandedTicket] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [newTicket, setNewTicket] = useState({
    subject: "",
    category: "general",
    message: "",
  });

  // Mock user's tickets
  const tickets: UserTicket[] = [
    {
      id: "ut1",
      subject: "How to upgrade to premium?",
      message: "I can't find the upgrade button on mobile. Can you help?",
      category: "general",
      status: "resolved",
      createdAt: "2026-01-30T08:10:00Z",
      replies: [
        {
          id: "r1",
          author: "Support Team",
          isAdmin: true,
          message:
            "You can upgrade from the Pricing page or your Dashboard > Subscription. On mobile, tap the menu icon > Pricing.",
          createdAt: "2026-01-30T14:00:00Z",
        },
        {
          id: "r2",
          author: "You",
          isAdmin: false,
          message: "Found it, thanks!",
          createdAt: "2026-01-30T15:00:00Z",
        },
      ],
    },
    {
      id: "ut2",
      subject: "PDF merge not working",
      message:
        "When I try to merge 3 PDFs, the process hangs. I've tried multiple times.",
      category: "bug",
      status: "in-progress",
      createdAt: "2026-02-04T11:20:00Z",
      replies: [
        {
          id: "r3",
          author: "Support Team",
          isAdmin: true,
          message:
            "We're investigating this issue. Could you tell us the browser and OS you're using?",
          createdAt: "2026-02-04T15:00:00Z",
        },
      ],
    },
  ];

  const handleSubmitTicket = () => {
    if (!newTicket.subject || !newTicket.message) return;
    console.log("Submitting ticket:", newTicket);
    setShowNewTicket(false);
    setNewTicket({ subject: "", category: "general", message: "" });
    // TODO: integrate with real API
  };

  const handleSendReply = (ticketId: string) => {
    if (!replyText.trim()) return;
    console.log("Sending reply to:", ticketId, replyText);
    setReplyText("");
    // TODO: integrate with real API
  };

  return (
    <div className="max-w-3xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Support</h1>
          <p className="text-muted-foreground">
            Get help with your account or report issues
          </p>
        </div>
        <Button onClick={() => setShowNewTicket(true)}>
          <Plus className="w-4 h-4" />
          New Ticket
        </Button>
      </div>

      {/* New Ticket Form */}
      {showNewTicket && (
        <div className="bg-card border border-border rounded-2xl p-6">
          <h2 className="text-lg font-bold mb-4">Submit a Support Ticket</h2>
          <div className="space-y-4">
            <Input
              label="Subject"
              placeholder="Brief description of your issue"
              value={newTicket.subject}
              onChange={(e) =>
                setNewTicket({ ...newTicket, subject: e.target.value })
              }
            />
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Category</label>
              <select
                value={newTicket.category}
                onChange={(e) =>
                  setNewTicket({ ...newTicket, category: e.target.value })
                }
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 cursor-pointer"
              >
                <option value="general">General Question</option>
                <option value="bug">Bug Report</option>
                <option value="billing">Billing Issue</option>
                <option value="feature">Feature Request</option>
                <option value="complaint">Complaint</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Message</label>
              <textarea
                placeholder="Describe your issue in detail..."
                rows={4}
                value={newTicket.message}
                onChange={(e) =>
                  setNewTicket({ ...newTicket, message: e.target.value })
                }
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
              />
            </div>
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={() => setShowNewTicket(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmitTicket}>Submit Ticket</Button>
            </div>
          </div>
        </div>
      )}

      {/* Tickets List */}
      <div className="space-y-4">
        <h2 className="font-bold">Your Tickets ({tickets.length})</h2>

        {tickets.length === 0 ? (
          <div className="bg-card border border-border rounded-2xl p-12 text-center">
            <MessageSquare className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
            <p className="text-muted-foreground">No support tickets yet</p>
            <Button
              className="mt-4"
              variant="outline"
              onClick={() => setShowNewTicket(true)}
            >
              Create Your First Ticket
            </Button>
          </div>
        ) : (
          tickets.map((ticket) => (
            <div
              key={ticket.id}
              className="bg-card border border-border rounded-2xl overflow-hidden"
            >
              {/* Ticket Header */}
              <button
                onClick={() =>
                  setExpandedTicket(
                    expandedTicket === ticket.id ? null : ticket.id
                  )
                }
                className="w-full p-4 flex items-start gap-3 text-left hover:bg-muted/30 transition-colors cursor-pointer"
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    ticket.status === "resolved" || ticket.status === "closed"
                      ? "bg-success/10"
                      : ticket.status === "in-progress"
                      ? "bg-primary/10"
                      : "bg-accent/10"
                  }`}
                >
                  {ticket.status === "resolved" || ticket.status === "closed" ? (
                    <CheckCircle className="w-5 h-5 text-success" />
                  ) : ticket.status === "in-progress" ? (
                    <Clock className="w-5 h-5 text-primary" />
                  ) : (
                    <MessageSquare className="w-5 h-5 text-accent" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-sm truncate">
                      {ticket.subject}
                    </h3>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-medium shrink-0 ${
                        ticket.status === "resolved" || ticket.status === "closed"
                          ? "bg-success/10 text-success"
                          : ticket.status === "in-progress"
                          ? "bg-primary/10 text-primary"
                          : "bg-accent/10 text-accent"
                      }`}
                    >
                      {ticket.status}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {ticket.category} ·{" "}
                    {new Date(ticket.createdAt).toLocaleDateString()}
                  </p>
                </div>
                {expandedTicket === ticket.id ? (
                  <ChevronUp className="w-5 h-5 text-muted-foreground shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-muted-foreground shrink-0" />
                )}
              </button>

              {/* Expanded Content */}
              {expandedTicket === ticket.id && (
                <div className="border-t border-border">
                  {/* Original Message */}
                  <div className="p-4 bg-muted/30">
                    <p className="text-xs text-muted-foreground mb-1">
                      Your original message:
                    </p>
                    <p className="text-sm">{ticket.message}</p>
                  </div>

                  {/* Replies */}
                  {ticket.replies.length > 0 && (
                    <div className="px-4 py-3 space-y-4">
                      {ticket.replies.map((reply) => (
                        <div
                          key={reply.id}
                          className={`flex gap-3 ${
                            reply.isAdmin ? "" : "flex-row-reverse"
                          }`}
                        >
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                              reply.isAdmin ? "bg-primary/10" : "bg-muted"
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
                                  ? "bg-primary/10"
                                  : "bg-muted"
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

                  {/* Reply Input (if not closed) */}
                  {ticket.status !== "closed" && ticket.status !== "resolved" && (
                    <div className="p-4 border-t border-border flex gap-3">
                      <input
                        type="text"
                        placeholder="Type your reply..."
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        className="flex-1 px-4 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleSendReply(ticket.id);
                        }}
                      />
                      <Button
                        onClick={() => handleSendReply(ticket.id)}
                        size="sm"
                      >
                        <Send className="w-4 h-4" />
                        Send
                      </Button>
                    </div>
                  )}

                  {/* Resolved message */}
                  {ticket.status === "resolved" && (
                    <div className="p-4 border-t border-border bg-success/5 text-center">
                      <p className="text-sm text-success">
                        This ticket has been resolved. Need more help?{" "}
                        <button
                          onClick={() => setShowNewTicket(true)}
                          className="underline cursor-pointer"
                        >
                          Open a new ticket
                        </button>
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Help Resources */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <h2 className="font-bold mb-4">Quick Help</h2>
        <div className="space-y-3">
          {[
            { q: "How do I merge PDFs?", link: "/tool/merge-pdf" },
            { q: "How do I upgrade to Premium?", link: "/pricing" },
            { q: "What are the file size limits?", link: "/pricing" },
            { q: "How do I reset my password?", link: "/auth/forgot-password" },
          ].map((item) => (
            <a
              key={item.q}
              href={item.link}
              className="block p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors text-sm"
            >
              {item.q}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
