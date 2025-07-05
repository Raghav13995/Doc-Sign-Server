import SavedSignature from '../models/SavedSignature.js';



export const getSavedSignatureImage = async (req, res) => {
  try {
    const userId = req.user;
    const record = await SavedSignature.findOne({ user: userId });

    if (!record || !record.images || record.images.length === 0) {
      return res.status(404).json({ message: "No saved signatures found" });
    }

    res.status(200).json({ signatureImages: record.images });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch signatures", error: err.message });
  }
};


export const saveSignatureImage = async (req, res) => {
  try {
    const userId = req.user;
    const { image } = req.body;

    if (!image) {
      return res.status(400).json({ message: "No image provided" });
    }

    let record = await SavedSignature.findOne({ user: userId });

    if (record) {
      record.images.push(image);
      await record.save();
    } else {
      record = await SavedSignature.create({
        user: userId,
        images: [image],
      });
    }

    res.status(200).json({ message: "Signature saved", signatureImage: image });
  } catch (err) {
    res.status(500).json({ message: "Failed to save signature", error: err.message });
  }
};

// DELETE /api/saved-signature/delete/:index
export const deleteSavedSignatureImage = async (req, res) => {
  try {
    const userId = req.user;
    const index = parseInt(req.params.index, 10);

    const record = await SavedSignature.findOne({ user: userId });

    if (!record || !record.images || index < 0 || index >= record.images.length) {
      return res.status(404).json({ message: "Signature not found" });
    }

    record.images.splice(index, 1);
    await record.save();

    res.status(200).json({ message: "Signature deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete signature", error: err.message });
  }
};