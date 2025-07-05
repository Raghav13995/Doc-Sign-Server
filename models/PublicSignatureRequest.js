import mongoose from "mongoose";

const publicSignatureRequestSchema = new mongoose.Schema({
  documentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Document",
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  token: {
    type: String,
    required: true,
    unique: true,
  },
  isSigned: {
    type: Boolean,
    default: false,
  },
  signedAt: {
    type: Date,
  },
  x: {
    type: Number,
    required: false,
  },
  y: {
    type: Number,
    required: false,
  },
  page: {
    type: Number,
    required: false,
  },
  image: {
    type: String, // Base64 encoded image or URL
    default: null,
  },
  width: {
    type: Number,
    default: 100, // Default width for the signature
  },
  height: {
    type: Number,
    default: 50, // Default height for the signature
  },

}, { timestamps: true });

export default mongoose.model("PublicSignatureRequest", publicSignatureRequestSchema);
