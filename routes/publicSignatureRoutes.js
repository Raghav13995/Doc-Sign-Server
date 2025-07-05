import express from "express";
import { sendPublicSignatureLink, getDocumentByToken, confirmPublicSignature,submitDocument,docSigner} from "../controllers/publicSignatureController.js";
import { auth } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Protected route for authenticated users to send public signature link
router.post("/request", auth, sendPublicSignatureLink);

router.get("/view/:token", getDocumentByToken);
router.post("/submit/:token",submitDocument);
router.post("/confirm/:token", confirmPublicSignature);
router.get("/docSigner/:documentId",docSigner);

export default router;
