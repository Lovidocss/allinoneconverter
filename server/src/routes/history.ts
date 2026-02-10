import express from "express";
import { FileHistory } from "../models/FileHistory.js";
import { verifyToken, AuthRequest } from "../middleware/auth.js";

const router = express.Router();

// Get user's usage statistics (MUST come before /:id route)
router.get("/stats/summary", verifyToken, async (req, res) => {
  try {
    const userId = (req as AuthRequest).user?.id;

    // Get today's date range
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [totalFiles, todayFiles, totalSize, toolStats] = await Promise.all([
      FileHistory.countDocuments({ userId }),
      FileHistory.countDocuments({ 
        userId, 
        createdAt: { $gte: today, $lt: tomorrow } 
      }),
      FileHistory.aggregate([
        { $match: { userId: userId } },
        { $group: { _id: null, totalSize: { $sum: "$fileSize" } } }
      ]),
      FileHistory.aggregate([
        { $match: { userId: userId } },
        { $group: { _id: "$toolUsed", count: { $sum: 1 }, toolName: { $first: "$toolName" } } },
        { $sort: { count: -1 } },
        { $limit: 5 }
      ])
    ]);

    res.json({
      totalFiles,
      todayFiles,
      totalStorageBytes: totalSize[0]?.totalSize || 0,
      topTools: toolStats,
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({ message: "Failed to fetch statistics" });
  }
});

// Get user's file history
router.get("/", verifyToken, async (req, res) => {
  try {
    const userId = (req as AuthRequest).user?.id;
    const { page = 1, limit = 10, status, toolUsed } = req.query;

    const query: Record<string, unknown> = { userId };
    
    if (status) {
      query.status = status;
    }
    
    if (toolUsed) {
      query.toolUsed = toolUsed;
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [history, total] = await Promise.all([
      FileHistory.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      FileHistory.countDocuments(query),
    ]);

    res.json({
      history,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    console.error("Error fetching file history:", error);
    res.status(500).json({ message: "Failed to fetch file history" });
  }
});

// Get single history item
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const userId = (req as AuthRequest).user?.id;
    const { id } = req.params;

    const item = await FileHistory.findOne({ _id: id, userId }).lean();

    if (!item) {
      return res.status(404).json({ message: "History item not found" });
    }

    res.json(item);
  } catch (error) {
    console.error("Error fetching history item:", error);
    res.status(500).json({ message: "Failed to fetch history item" });
  }
});

// Create new history entry (called when processing starts)
router.post("/", verifyToken, async (req, res) => {
  try {
    const userId = (req as AuthRequest).user?.id;
    const { fileName, originalName, fileSize, fileType, toolUsed, toolName } = req.body;

    const history = await FileHistory.create({
      userId,
      fileName,
      originalName,
      fileSize,
      fileType,
      toolUsed,
      toolName,
      status: "processing",
    });

    res.status(201).json(history);
  } catch (error) {
    console.error("Error creating history entry:", error);
    res.status(500).json({ message: "Failed to create history entry" });
  }
});

// Update history entry (called when processing completes)
router.patch("/:id", verifyToken, async (req, res) => {
  try {
    const userId = (req as AuthRequest).user?.id;
    const { id } = req.params;
    const { status, resultUrl, errorMessage, processingTime } = req.body;

    const history = await FileHistory.findOneAndUpdate(
      { _id: id, userId },
      { status, resultUrl, errorMessage, processingTime },
      { new: true }
    );

    if (!history) {
      return res.status(404).json({ message: "History item not found" });
    }

    res.json(history);
  } catch (error) {
    console.error("Error updating history entry:", error);
    res.status(500).json({ message: "Failed to update history entry" });
  }
});

// Delete history entry
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const userId = (req as AuthRequest).user?.id;
    const { id } = req.params;

    const history = await FileHistory.findOneAndDelete({ _id: id, userId });

    if (!history) {
      return res.status(404).json({ message: "History item not found" });
    }

    res.json({ message: "History item deleted" });
  } catch (error) {
    console.error("Error deleting history entry:", error);
    res.status(500).json({ message: "Failed to delete history entry" });
  }
});

export default router;
