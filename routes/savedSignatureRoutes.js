import express from 'express';
import {
  saveSignatureImage,
  getSavedSignatureImage,
   deleteSavedSignatureImage
} from '../controllers/SavedSignatureController.js';
import { auth } from '../middleware/authMiddleware.js';

const router = express.Router();

// ✅ POST a new signature (adds to array)
router.post('/save', auth, saveSignatureImage);

// ✅ GET all saved signatures for a user
router.get('/me', auth, getSavedSignatureImage);

router.delete("/delete/:index", auth, deleteSavedSignatureImage);

export default router;
