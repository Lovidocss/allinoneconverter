import { Router, Response } from "express";
import { User, Ticket, FileHistory } from "../models/index.js";
import { verifyToken, verifyAdmin, AuthRequest } from "../middleware/auth.js";
import mongoose from "mongoose";

const router = Router();

// GET admin dashboard stats
router.get("/stats", verifyToken, verifyAdmin, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // Get today's date range
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Get this week's date range
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    // Get this month's date range
    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);

    const [
      totalUsers,
      premiumUsers,
      activeToday,
      newUsersThisWeek,
      openTickets,
      resolvedTickets,
      totalFilesProcessed,
      todayFilesProcessed,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ subscription: { $in: ["pro", "business"] } }),
      User.countDocuments({ updatedAt: { $gte: today, $lt: tomorrow } }),
      User.countDocuments({ createdAt: { $gte: weekAgo } }),
      Ticket.countDocuments({ status: { $in: ["open", "in-progress"] } }),
      Ticket.countDocuments({ status: { $in: ["resolved", "closed"] } }),
      FileHistory.countDocuments(),
      FileHistory.countDocuments({ createdAt: { $gte: today, $lt: tomorrow } }),
    ]);

    // Calculate revenue (assuming $9/month for pro, $29/month for business)
    const proUsers = await User.countDocuments({ subscription: "pro" });
    const businessUsers = await User.countDocuments({ subscription: "business" });
    const monthlyRevenue = (proUsers * 9) + (businessUsers * 29);

    res.json({
      totalUsers,
      premiumUsers,
      freeUsers: totalUsers - premiumUsers,
      activeToday,
      newUsersThisWeek,
      totalRevenue: monthlyRevenue * 12, // Approximate annual
      monthlyRevenue,
      totalFilesProcessed,
      todayFilesProcessed,
      openTickets,
      resolvedTickets,
      churnRate: 2.3, // Could calculate from cancelled subscriptions
      avgSessionTime: "12m 34s", // Would need session tracking
    });
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// GET user activity for charts (last 7 days)
router.get("/activity", verifyToken, verifyAdmin, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const days = parseInt(req.query.days as string) || 7;
    const activity = [];

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const nextDay = new Date(date);
      nextDay.setDate(nextDay.getDate() + 1);

      const [usersActive, filesProcessed] = await Promise.all([
        User.countDocuments({ updatedAt: { $gte: date, $lt: nextDay } }),
        FileHistory.countDocuments({ createdAt: { $gte: date, $lt: nextDay } }),
      ]);

      activity.push({
        date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        users: usersActive,
        filesProcessed,
      });
    }

    res.json({ activity });
  } catch (error) {
    console.error("Error fetching activity:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// GET recent users
router.get("/recent-users", verifyToken, verifyAdmin, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const limit = parseInt(req.query.limit as string) || 5;
    
    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    // Get file counts for each user
    const usersWithFiles = await Promise.all(
      users.map(async (user) => {
        const filesCount = await FileHistory.countDocuments({ userId: user._id });
        return {
          ...user,
          id: user._id,
          filesProcessed: filesCount,
        };
      })
    );

    res.json({ users: usersWithFiles });
  } catch (error) {
    console.error("Error fetching recent users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// GET recent tickets
router.get("/recent-tickets", verifyToken, verifyAdmin, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const limit = parseInt(req.query.limit as string) || 5;
    
    const tickets = await Ticket.find({ status: { $ne: "closed" } })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    res.json({ tickets });
  } catch (error) {
    console.error("Error fetching recent tickets:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// GET all users with pagination and filters (enhanced)
router.get("/users", verifyToken, verifyAdmin, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { 
      search, 
      plan, // 'free' or 'premium' 
      status, // 'active', 'suspended', 'banned'
      page = "1", 
      limit = "20",
      sortBy = "createdAt",
      sortOrder = "desc"
    } = req.query;

    const query: Record<string, unknown> = {};
    
    if (search) {
      query.$or = [
        { email: { $regex: search, $options: "i" } },
        { name: { $regex: search, $options: "i" } },
      ];
    }
    
    if (plan === "free") {
      query.subscription = "free";
    } else if (plan === "premium") {
      query.subscription = { $in: ["pro", "business"] };
    }

    // Status filter (we'll add a status field to users)
    if (status) {
      query.status = status;
    }

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const sortDirection = sortOrder === "asc" ? 1 : -1;

    const [total, users] = await Promise.all([
      User.countDocuments(query),
      User.find(query)
        .select("-password")
        .sort({ [sortBy as string]: sortDirection })
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum)
        .lean(),
    ]);

    // Get file counts for each user
    const usersWithStats = await Promise.all(
      users.map(async (user) => {
        const filesCount = await FileHistory.countDocuments({ userId: user._id });
        return {
          ...user,
          id: user._id,
          filesProcessed: filesCount,
          plan: user.subscription === "free" ? "free" : "premium",
          status: (user as any).status || "active", // Default to active if not set
          joinedAt: user.createdAt,
          lastActive: user.updatedAt,
        };
      })
    );

    res.json({
      users: usersWithStats,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// PATCH update user status/plan (admin)
router.patch("/users/:id", verifyToken, verifyAdmin, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { status, subscription, name, role } = req.body;
    const updates: Record<string, unknown> = {};

    if (status) updates.status = status;
    if (subscription) updates.subscription = subscription;
    if (name) updates.name = name;
    if (role) updates.role = role;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true }
    ).select("-password");

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.json({ message: "User updated", user });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// DELETE user (admin)
router.delete("/users/:id", verifyToken, verifyAdmin, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    // Also delete user's file history
    await FileHistory.deleteMany({ userId: req.params.id });

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// POST create user (admin)
router.post("/users", verifyToken, verifyAdmin, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { email, name, password, subscription, role } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: "User with this email already exists" });
      return;
    }

    const bcrypt = await import("bcryptjs");
    const hashedPassword = await bcrypt.hash(password || "temp123", 12);

    const user = await User.create({
      email,
      name,
      password: hashedPassword,
      subscription: subscription || "free",
      role: role || "user",
      status: "active",
    });

    res.status(201).json({
      message: "User created successfully",
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        subscription: user.subscription,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// GET all tickets with filters (enhanced)
router.get("/tickets", verifyToken, verifyAdmin, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { 
      status, 
      priority, 
      category,
      search,
      page = "1", 
      limit = "20" 
    } = req.query;

    const query: Record<string, unknown> = {};
    if (status && status !== "all") query.status = status;
    if (priority && priority !== "all") query.priority = priority;
    if (category && category !== "all") query.category = category;
    if (search) {
      query.$or = [
        { subject: { $regex: search, $options: "i" } },
        { userEmail: { $regex: search, $options: "i" } },
        { userName: { $regex: search, $options: "i" } },
      ];
    }

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);

    const [total, tickets] = await Promise.all([
      Ticket.countDocuments(query),
      Ticket.find(query)
        .sort({ createdAt: -1 })
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum)
        .lean(),
    ]);

    res.json({
      tickets,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error("Error fetching tickets:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// GET single ticket
router.get("/tickets/:id", verifyToken, verifyAdmin, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const ticket = await Ticket.findById(req.params.id).lean();

    if (!ticket) {
      res.status(404).json({ message: "Ticket not found" });
      return;
    }

    res.json({ ticket });
  } catch (error) {
    console.error("Error fetching ticket:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// PATCH update ticket
router.patch("/tickets/:id", verifyToken, verifyAdmin, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { status, priority, reply } = req.body;
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      res.status(404).json({ message: "Ticket not found" });
      return;
    }

    if (status) ticket.status = status;
    if (priority) ticket.priority = priority;

    if (reply) {
      ticket.replies.push({
        message: reply,
        isAdmin: true,
        createdAt: new Date(),
      });
    }

    await ticket.save();
    res.json({ message: "Ticket updated", ticket });
  } catch (error) {
    console.error("Error updating ticket:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// DELETE ticket
router.delete("/tickets/:id", verifyToken, verifyAdmin, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const ticket = await Ticket.findByIdAndDelete(req.params.id);

    if (!ticket) {
      res.status(404).json({ message: "Ticket not found" });
      return;
    }

    res.json({ message: "Ticket deleted successfully" });
  } catch (error) {
    console.error("Error deleting ticket:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// GET subscriptions (users with premium plans)
router.get("/subscriptions", verifyToken, verifyAdmin, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { status, plan, search, page = "1", limit = "20" } = req.query;

    const query: Record<string, unknown> = {
      subscription: { $in: ["pro", "business"] },
    };

    if (plan === "monthly") {
      query.subscriptionPlan = "monthly";
    } else if (plan === "yearly") {
      query.subscriptionPlan = "yearly";
    }

    if (search) {
      query.$or = [
        { email: { $regex: search, $options: "i" } },
        { name: { $regex: search, $options: "i" } },
      ];
    }

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);

    const [total, users] = await Promise.all([
      User.countDocuments(query),
      User.find(query)
        .select("-password")
        .sort({ createdAt: -1 })
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum)
        .lean(),
    ]);

    // Transform to subscription format
    const subscriptions = users.map((user) => ({
      id: user._id,
      oderId: user._id,
      userName: user.name,
      userEmail: user.email,
      plan: (user as any).subscriptionPlan || "monthly",
      amount: user.subscription === "pro" ? 9 : 29,
      status: (user as any).subscriptionStatus || "active",
      startDate: user.createdAt,
      nextBilling: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      paymentMethod: (user as any).paymentMethod || "Card •••• 4242",
    }));

    res.json({
      subscriptions,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error("Error fetching subscriptions:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// GET analytics data
router.get("/analytics", verifyToken, verifyAdmin, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const days = parseInt(req.query.days as string) || 30;
    
    // User growth over time
    const userGrowth = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(23, 59, 59, 999);
      
      const count = await User.countDocuments({ createdAt: { $lte: date } });
      userGrowth.push({
        date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        users: count,
      });
    }

    // Files processed per day
    const filesPerDay = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      const nextDay = new Date(date);
      nextDay.setDate(nextDay.getDate() + 1);

      const count = await FileHistory.countDocuments({ 
        createdAt: { $gte: date, $lt: nextDay } 
      });
      filesPerDay.push({
        date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        files: count,
      });
    }

    // Tool usage stats
    const toolUsage = await FileHistory.aggregate([
      { $group: { _id: "$toolUsed", count: { $sum: 1 }, toolName: { $first: "$toolName" } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    // User plan distribution
    const planDistribution = await User.aggregate([
      { $group: { _id: "$subscription", count: { $sum: 1 } } },
    ]);

    res.json({
      userGrowth,
      filesPerDay,
      toolUsage,
      planDistribution,
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// GET/PUT admin settings
router.get("/settings", verifyToken, verifyAdmin, async (req: AuthRequest, res: Response): Promise<void> => {
  // In production, store settings in a Settings collection
  res.json({
    siteName: "🫶iDocs",
    siteUrl: "https://idocs.app",
    supportEmail: "support@idocs.app",
    maxFileSize: 50, // MB
    maxFilesPerRequest: 20,
    retentionDays: 1, // Days to keep processed files
    maintenanceMode: false,
    allowRegistration: true,
    proPriceMonthly: 9,
    proPriceYearly: 79,
    businessPriceMonthly: 29,
    businessPriceYearly: 249,
  });
});

router.put("/settings", verifyToken, verifyAdmin, async (req: AuthRequest, res: Response): Promise<void> => {
  // In production, save settings to a Settings collection
  res.json({ message: "Settings updated successfully", settings: req.body });
});

export default router;
