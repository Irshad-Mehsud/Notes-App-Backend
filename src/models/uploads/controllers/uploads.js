
import uploadFile from "../services/uploads.js";

const uploadController = async (req, res) => {
  // Log the received file object for debugging
  console.log("Received file:", req.file);
  try {
    // Check for file presence and validity
    if (!req.file) {
      return res.status(400).json({ status: 400, error: "No file uploaded. Multer did not populate req.file." });
    }
    if (!req.file.buffer) {
      return res.status(400).json({ status: 400, error: "Uploaded file missing buffer property." });
    }
    if (!req.file.mimetype || typeof req.file.mimetype !== "string") {
      return res.status(400).json({ status: 400, error: "Uploaded file missing or invalid mimetype." });
    }

    const imageUrl = await uploadFile(req.file.buffer, req.file.mimetype);

    res.status(200).json({
      status: 200,
      message: "File uploaded successfully",
      url: imageUrl,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ status: 500, error: error.message || "Internal Server Error" });
  }
};

export default uploadController;