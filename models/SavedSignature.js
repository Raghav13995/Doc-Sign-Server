import mongoose from "mongoose";

const savedSignatureSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  images: [
    {
      type: String, // Base64 image string
      required: true,
    }
  ],
}, { timestamps: true });

export default mongoose.model("SavedSignature", savedSignatureSchema);
