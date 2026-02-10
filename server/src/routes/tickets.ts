import { Router, Request, Response } from "express";
import { Ticket } from "../models/index.js";
import { verifyToken, verifyAdmin, AuthRequest } from "../middleware/auth.js";

const router = Router();

// GET all tickets (admin only)
router.get("/", verifyToken, verifyAdmin, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { status, priority, page = "1", limit = "20" } = req.query;

    const query: Record<string, string> = {};
    if (status) query.status = status as string;
    if (priority) query.priority = priority as string;

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);

    const total = await Ticket.countDocuments(query);
    const tickets = await Ticket.find(query)
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum)
      .lean();

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

// POST create new ticket (public)
router.post("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const { userEmail, userName, subject, message, category, priority, attachments } = req.body;

    if (!userEmail || !userName || !subject || !message) {
      res.status(400).json({ message: "Required fields are missing" });
      return;
    }

    const ticket = await Ticket.create({
      userEmail,
      userName,
      subject,
      message,
      category: category || "general",
      priority: priority || "medium",
      attachments: attachments || [],
      status: "open",
    });

    res.status(201).json({
      message: "Ticket created successfully",
      ticket,
    });
  } catch (error) {
    console.error("Error creating ticket:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// GET single ticket
router.get("/:id", async (req: Request, res: Response): Promise<void> => {
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

// PATCH update ticket (admin only)
router.patch("/:id", verifyToken, verifyAdmin, async (req: AuthRequest, res: Response): Promise<void> => {
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

    res.json({
      message: "Ticket updated successfully",
      ticket,
    });
  } catch (error) {
    console.error("Error updating ticket:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// DELETE ticket (admin only)
router.delete("/:id", verifyToken, verifyAdmin, async (req: AuthRequest, res: Response): Promise<void> => {
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

export default router;
