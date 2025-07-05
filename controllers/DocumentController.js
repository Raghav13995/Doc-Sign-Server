import Document from '../models/Document.js';
import fs from 'fs';
import path from 'path';

// Upload PDF document
export const uploadDocument = async (req, res) => {
  try {
    const file = req.file;
    const userId = req.user;

    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // LOG BOTH RAW AND CLEAN PATH
    console.log("📥 Original file.path:", file.path);
    const normalizedPath = file.path.replace(/\\/g, "/");
    console.log("✅ Normalized file path:", normalizedPath);

    const newDoc = await Document.create({
      filename: file.originalname,
      filepath: normalizedPath,
      uploadedBy: userId
    });

    res.status(201).json({
      message: 'File uploaded successfully',
      document: newDoc,
    });
  } catch (error) {
    console.error("🔥 Upload failed:", error);
    res.status(500).json({ message: 'Upload failed', error: error.message });
  }
};


// Get all documents for a user
export const getUserDocuments = async (req, res) => {
  try {
    const userId = req.user;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const documents = await Document.find({ uploadedBy: userId }).sort({ uploadedAt: -1 });

    res.status(200).json({ documents });
  } catch (error) {
    console.error("🔥 Fetch documents failed:", error);
    res.status(500).json({
      message: 'Failed to fetch documents',
      error: error.message,
    });
  }
};
// ✅ NEW DELETE FUNCTION
export const deleteDocument = async (req, res) => {
  try {
    const userId = req.user;
    const { id } = req.params;

    const doc = await Document.findOne({ _id: id, uploadedBy: userId });
    if (!doc) {
      return res.status(404).json({ message: 'Document not found' });
    }

    // Remove file from filesystem
    const fullPath = path.resolve(doc.filepath);
    fs.unlink(fullPath, (err) => {
      if (err) {
        console.error("⚠️ File delete error:", err);
      }
    });

    // Remove document from DB
    await Document.deleteOne({ _id: id });

    res.status(200).json({ message: 'Document deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete document', error: error.message });
  }
};