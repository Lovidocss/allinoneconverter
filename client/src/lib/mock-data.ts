// ─── Mock Data for Dashboard (replace with real DB later) ───

export interface User {
  id: string;
  name: string;
  email: string;
  plan: "free" | "premium";
  status: "active" | "suspended" | "banned";
  joinedAt: string;
  lastActive: string;
  filesProcessed: number;
  avatar?: string;
}

export interface Subscription {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  plan: "monthly" | "yearly";
  amount: number;
  status: "active" | "cancelled" | "expired" | "past_due";
  startDate: string;
  nextBilling: string;
  paymentMethod: string;
}

export interface Ticket {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  subject: string;
  message: string;
  category: "bug" | "billing" | "feature" | "general" | "complaint";
  priority: "low" | "medium" | "high" | "urgent";
  status: "open" | "in-progress" | "resolved" | "closed";
  createdAt: string;
  updatedAt: string;
  replies: TicketReply[];
}

export interface TicketReply {
  id: string;
  author: string;
  isAdmin: boolean;
  message: string;
  createdAt: string;
}

export interface AdminStats {
  totalUsers: number;
  premiumUsers: number;
  freeUsers: number;
  activeToday: number;
  totalRevenue: number;
  monthlyRevenue: number;
  totalFilesProcessed: number;
  openTickets: number;
  resolvedTickets: number;
  newUsersThisWeek: number;
  churnRate: number;
  avgSessionTime: string;
}

export interface UserActivity {
  date: string;
  users: number;
  filesProcessed: number;
}

// ─── Sample Data ───

export const mockStats: AdminStats = {
  totalUsers: 124853,
  premiumUsers: 8742,
  freeUsers: 116111,
  activeToday: 3842,
  totalRevenue: 687420,
  monthlyRevenue: 78678,
  totalFilesProcessed: 4283921,
  openTickets: 47,
  resolvedTickets: 1283,
  newUsersThisWeek: 1247,
  churnRate: 2.3,
  avgSessionTime: "12m 34s",
};

export const mockUsers: User[] = [
  { id: "u1", name: "Sarah Johnson", email: "sarah@example.com", plan: "premium", status: "active", joinedAt: "2025-03-15", lastActive: "2026-02-06", filesProcessed: 342 },
  { id: "u2", name: "Mike Chen", email: "mike@example.com", plan: "free", status: "active", joinedAt: "2025-07-22", lastActive: "2026-02-05", filesProcessed: 28 },
  { id: "u3", name: "Emily Davis", email: "emily@example.com", plan: "premium", status: "active", joinedAt: "2025-01-10", lastActive: "2026-02-06", filesProcessed: 1205 },
  { id: "u4", name: "Alex Rivera", email: "alex@example.com", plan: "free", status: "suspended", joinedAt: "2025-09-03", lastActive: "2026-01-20", filesProcessed: 5 },
  { id: "u5", name: "Priya Patel", email: "priya@example.com", plan: "premium", status: "active", joinedAt: "2025-05-18", lastActive: "2026-02-06", filesProcessed: 876 },
  { id: "u6", name: "James Wilson", email: "james@example.com", plan: "free", status: "active", joinedAt: "2025-11-29", lastActive: "2026-02-04", filesProcessed: 15 },
  { id: "u7", name: "Lisa Thompson", email: "lisa@example.com", plan: "premium", status: "active", joinedAt: "2025-02-14", lastActive: "2026-02-06", filesProcessed: 523 },
  { id: "u8", name: "David Kim", email: "david@example.com", plan: "free", status: "banned", joinedAt: "2025-08-07", lastActive: "2025-12-15", filesProcessed: 2 },
  { id: "u9", name: "Ana Martinez", email: "ana@example.com", plan: "premium", status: "active", joinedAt: "2025-04-25", lastActive: "2026-02-06", filesProcessed: 691 },
  { id: "u10", name: "Tom Brown", email: "tom@example.com", plan: "free", status: "active", joinedAt: "2025-12-01", lastActive: "2026-02-03", filesProcessed: 42 },
  { id: "u11", name: "Rachel Green", email: "rachel@example.com", plan: "premium", status: "active", joinedAt: "2025-06-11", lastActive: "2026-02-06", filesProcessed: 458 },
  { id: "u12", name: "Kevin Lee", email: "kevin@example.com", plan: "free", status: "active", joinedAt: "2026-01-05", lastActive: "2026-02-06", filesProcessed: 8 },
];

export const mockSubscriptions: Subscription[] = [
  { id: "s1", userId: "u1", userName: "Sarah Johnson", userEmail: "sarah@example.com", plan: "monthly", amount: 9, status: "active", startDate: "2025-10-15", nextBilling: "2026-02-15", paymentMethod: "Visa •••• 4242" },
  { id: "s2", userId: "u3", userName: "Emily Davis", userEmail: "emily@example.com", plan: "yearly", amount: 79, status: "active", startDate: "2025-01-10", nextBilling: "2026-01-10", paymentMethod: "Mastercard •••• 5555" },
  { id: "s3", userId: "u5", userName: "Priya Patel", userEmail: "priya@example.com", plan: "monthly", amount: 9, status: "active", startDate: "2025-08-18", nextBilling: "2026-02-18", paymentMethod: "PayPal priya@email.com" },
  { id: "s4", userId: "u7", userName: "Lisa Thompson", userEmail: "lisa@example.com", plan: "yearly", amount: 79, status: "active", startDate: "2025-02-14", nextBilling: "2026-02-14", paymentMethod: "Visa •••• 1234" },
  { id: "s5", userId: "u9", userName: "Ana Martinez", userEmail: "ana@example.com", plan: "monthly", amount: 9, status: "past_due", startDate: "2025-04-25", nextBilling: "2026-02-25", paymentMethod: "Visa •••• 9876" },
  { id: "s6", userId: "u11", userName: "Rachel Green", userEmail: "rachel@example.com", plan: "monthly", amount: 9, status: "active", startDate: "2025-09-11", nextBilling: "2026-02-11", paymentMethod: "Mastercard •••• 3333" },
];

export const mockTickets: Ticket[] = [
  {
    id: "t1", userId: "u2", userName: "Mike Chen", userEmail: "mike@example.com",
    subject: "PDF merge not working with large files",
    message: "When I try to merge PDFs over 20MB each, the process hangs and eventually fails. I've tried multiple times with different files.",
    category: "bug", priority: "high", status: "open",
    createdAt: "2026-02-05T14:30:00Z", updatedAt: "2026-02-05T14:30:00Z",
    replies: [],
  },
  {
    id: "t2", userId: "u1", userName: "Sarah Johnson", userEmail: "sarah@example.com",
    subject: "Billing charged twice this month",
    message: "I was charged $9 twice on Feb 1st. Please refund the duplicate charge.",
    category: "billing", priority: "urgent", status: "in-progress",
    createdAt: "2026-02-02T09:15:00Z", updatedAt: "2026-02-03T11:00:00Z",
    replies: [
      { id: "r1", author: "Support Team", isAdmin: true, message: "We're looking into this. Can you provide your transaction IDs?", createdAt: "2026-02-03T11:00:00Z" },
    ],
  },
  {
    id: "t3", userId: "u6", userName: "James Wilson", userEmail: "james@example.com",
    subject: "Request: Add HEIC to PDF conversion",
    message: "Would love to see HEIC to PDF conversion added. I frequently need to convert iPhone photos.",
    category: "feature", priority: "low", status: "open",
    createdAt: "2026-02-04T16:45:00Z", updatedAt: "2026-02-04T16:45:00Z",
    replies: [],
  },
  {
    id: "t4", userId: "u10", userName: "Tom Brown", userEmail: "tom@example.com",
    subject: "Slow processing speed",
    message: "The compression tool is extremely slow compared to last month. Is there a server issue?",
    category: "complaint", priority: "medium", status: "open",
    createdAt: "2026-02-03T20:00:00Z", updatedAt: "2026-02-03T20:00:00Z",
    replies: [],
  },
  {
    id: "t5", userId: "u5", userName: "Priya Patel", userEmail: "priya@example.com",
    subject: "Cannot download converted files",
    message: "After converting PDF to Word, the download button doesn't respond. Using Chrome on Mac.",
    category: "bug", priority: "high", status: "in-progress",
    createdAt: "2026-02-01T12:20:00Z", updatedAt: "2026-02-02T09:30:00Z",
    replies: [
      { id: "r2", author: "Support Team", isAdmin: true, message: "We've identified the issue with Chrome. A fix is being deployed.", createdAt: "2026-02-02T09:30:00Z" },
    ],
  },
  {
    id: "t6", userId: "u12", userName: "Kevin Lee", userEmail: "kevin@example.com",
    subject: "How to upgrade to premium?",
    message: "I can't find the upgrade button on mobile. Can you help?",
    category: "general", priority: "low", status: "resolved",
    createdAt: "2026-01-30T08:10:00Z", updatedAt: "2026-01-30T14:00:00Z",
    replies: [
      { id: "r3", author: "Support Team", isAdmin: true, message: "You can upgrade from the Pricing page or your Dashboard > Subscription. On mobile, tap the menu icon > Pricing.", createdAt: "2026-01-30T14:00:00Z" },
      { id: "r4", author: "Kevin Lee", isAdmin: false, message: "Found it, thanks!", createdAt: "2026-01-30T15:00:00Z" },
    ],
  },
  {
    id: "t7", userId: "u9", userName: "Ana Martinez", userEmail: "ana@example.com",
    subject: "Payment method update not saving",
    message: "I'm trying to update my credit card but it keeps showing the old one after saving.",
    category: "billing", priority: "medium", status: "open",
    createdAt: "2026-02-06T07:45:00Z", updatedAt: "2026-02-06T07:45:00Z",
    replies: [],
  },
];

export const mockActivity: UserActivity[] = [
  { date: "Jan 31", users: 3210, filesProcessed: 12400 },
  { date: "Feb 1", users: 3540, filesProcessed: 14200 },
  { date: "Feb 2", users: 3380, filesProcessed: 13100 },
  { date: "Feb 3", users: 3690, filesProcessed: 15800 },
  { date: "Feb 4", users: 3450, filesProcessed: 14600 },
  { date: "Feb 5", users: 3780, filesProcessed: 16200 },
  { date: "Feb 6", users: 3842, filesProcessed: 15900 },
];
