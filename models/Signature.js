import mongoose from 'mongoose';

const signatureSchema = new mongoose.Schema({
  documentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Document',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  x: {
    type: Number,
    required: true
  },
  y: {
    type: Number,
    required: true
  },
  page: {
    type: Number,
    required: true
  },
  signStatus: {
    type: String,
    enum: ['pending', 'signed', 'rejected'],
    default: 'signed'
  },
  image: {
    type: String, // Base64 encoded image or URL
    default: null
  },
  width: {
    type: Number,
    default: 100 // Default width for the signature
  },
  height: {
    type: Number,
    default: 50 // Default height for the signature
  }
}, { timestamps: true });

export default mongoose.model('Signature', signatureSchema);
