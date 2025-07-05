import express from 'express';
import { uploadDocument, getUserDocuments, deleteDocument } from '../controllers/DocumentController.js';
import { auth } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/multerConfig.js';


const router = express.Router();

// router.post('/upload', auth, upload.single('pdf'), uploadDocument);

router.post(
  "/upload",
  auth,
  upload.single("pdf"),
  (req, res, next) => {
    console.log("🛬 /upload route hit ✅");
    next();
  },
  uploadDocument
);

router.get('/', auth, getUserDocuments);
router.delete('/:id', auth, deleteDocument); 

export default router;
