import { Router, Response } from "express";
import bcrypt from "bcryptjs";
import { User } from "../models/index.js";
import { verifyToken, verifyAdmin, AuthRequest } from "../middleware/auth.js";

const router = Router();

// GET all users (admin only)
router.get("/", verifyToken, verifyAdmin, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { role, subscription, search, page = "1", limit = "20" } = req.query;

    const query: Record<string, unknown> = {};
    if (role) query.role = role;
    if (subscription) query.subscription = subscription;
    if (search) {
      query.$or = [
        { email: { $regex: search, $options: "i" } },
        { name: { $regex: search, $options: "i" } },
      ];
    }

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .select("-password")
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum)
      .lean();

    res.json({
      users,
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

// GET single user (admin only)
router.get("/:id", verifyToken, verifyAdmin, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.params.id).select("-password").lean();

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.json({ user });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// PATCH update user (admin only)
router.patch("/:id", verifyToken, verifyAdmin, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, role, subscription, password } = req.body;

    const user = await User.findById(req.params.id);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    if (name) user.name = name;
    if (role) user.role = role;
    if (subscription) user.subscription = subscription;
    if (password) {
      user.password = await bcrypt.hash(password, 12);
    }

    await user.save();

    res.json({
      message: "User updated successfully",
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        subscription: user.subscription,
      },
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// DELETE user (admin only)
router.delete("/:id", verifyToken, verifyAdmin, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
