import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import documentRoutes from './routes/documentRoutes.js';
import signatureRoutes from './routes/signatureRoutes.js';
import savedSignatureRoutes from './routes/savedSignatureRoutes.js';
import publicSignatureRoutes from "./routes/publicSignatureRoutes.js";
import auditRoutes from "./routes/auditRoutes.js";

import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
app.use(cors({
  origin: 'https://doc-sign-client-zeta.vercel.app',  // frontend URL
  credentials: true,                // allow cookies/auth headers
}));
app.use(express.json());
app.use(cookieParser()); 

const PORT = process.env.PORT || 5000;

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('MongoDB connected'))
.catch(err => console.error(err));

// Routes
import path from 'path';
const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/auth', authRoutes);
app.use('/api/docs', documentRoutes);
// app.use('/uploads', express.static('uploads'));
app.use('/api/signatures', signatureRoutes);
app.use('/api/saved-signature', savedSignatureRoutes);
app.use("/api/public-signature", publicSignatureRoutes);
app.use("/api/audit", auditRoutes);

app.post("/xyz", (req, res) => {
  console.log("Received request on /xyz");
  res.status(200).json({ message: "Hello from /xyz" });
});


// Basic Route

app.get('/', (req, res) => {
  res.send('Document Signature App Backend');
});

app.listen(PORT, () => {
  console.log(`Server running on Port ${PORT}`);
});
