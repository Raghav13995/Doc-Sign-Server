import Signature from '../models/Signature.js';

export const saveSignature = async (req, res) => {
  try {
    const { documentId, x, y, page, signStatus, image,height,width } = req.body;
    const userId = req.user;

    // Check if a signature already exists for this document+user+page combination
    const existingSignature = await Signature.findOne({
      documentId,
      userId,
      page
    });

    if (existingSignature) {
      // Update existing signature instead of creating new one
      existingSignature.x = x;
      existingSignature.y = y;
      existingSignature.image = image || existingSignature.image;
      existingSignature.signStatus = signStatus || existingSignature.signStatus;
      existingSignature.width = width;
      existingSignature.height = height;
      existingSignature.page = page;
      
      const updatedSignature = await existingSignature.save();
      return res.status(200).json({ 
        message: "Signature updated", 
        signature: updatedSignature 
      });
    }

    // Create new signature if none exists
    const newSignature = await Signature.create({
      documentId,
      userId,
      x,
      y,
      page,
      signStatus: signStatus || 'pending',
      image: image || null,
      width: width, 
      height: height 
    });

    res.status(201).json({ 
      message: "Signature created", 
      signature: newSignature 
    });
  } catch (error) {
    res.status(500).json({ 
      message: "Failed to save signature", 
      error: error.message 
    });
  }
};

export const getSignaturesForDocument = async (req, res) => {
  try {
    
    const { id } = req.params;
    console.log("Fetching signatures for document ID:", id);
    const signatures = await Signature.find({ documentId: id });

    res.status(200).json({ signatures });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch signatures", error: error.message });
  }
};
