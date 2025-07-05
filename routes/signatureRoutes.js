import express from 'express';
import { saveSignature, getSignaturesForDocument } from '../controllers/SignatureController.js';
import { auth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', auth, saveSignature); // POST /api/signatures
router.get('/:id', auth, getSignaturesForDocument); // GET /api/signatures/:id

export default router;
