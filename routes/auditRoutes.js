// routes/auditRoutes.js
import express from "express";
import AuditLog from "../models/AuditLog.js";
import { auth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/:fileId", auth, async (req, res) => {
  try {
    const logs = await AuditLog.find({ documentId: req.params.fileId }).sort({ timestamp: -1 });
    res.status(200).json({ logs });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch audit logs" });
  }
});

export default router;
