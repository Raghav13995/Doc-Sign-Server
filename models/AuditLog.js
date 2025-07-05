// models/AuditLog.js
import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema({
  documentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Document",
    required: true,
  },
  signerEmail: String, // for public signing
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  ip: String,
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("AuditLog", auditLogSchema);
