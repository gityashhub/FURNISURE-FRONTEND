import express from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";

const router = express.Router();
dotenv.config();

// Debug middleware to see raw request before multer
router.use((req, res, next) => {
  if (req.method === 'POST') {
    console.log('\n--- RAW REQUEST DEBUG ---');
    console.log('URL:', req.url);
    console.log('Content-Type:', req.headers['content-type']);
    console.log('Content-Length:', req.headers['content-length']);
  }
  next();
});

// Ensure the uploads directory exists
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Cloudinary configuration (use your environment variables)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Cloudinary storage for multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "uploads", // Cloudinary folder name
    allowed_formats: ["jpg", "jpeg", "png", "gif", "webp"],
    transformation: [{ width: 800, height: 800, crop: "limit" }], // Optional: resize
  },
});

// Only accept image files
function fileFilter(req, file, cb) {
  console.log('\n--- FILE FILTER DEBUG ---');
  console.log('File fieldname:', file.fieldname);
  console.log('File originalname:', file.originalname);
  console.log('File mimetype:', file.mimetype);
  console.log('File size (at filter):', file.size);
  
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(
    file.originalname.split(".").pop().toLowerCase()
  );
  const mimetype = allowedTypes.test(file.mimetype);
  
  console.log('Extension valid:', extname);
  console.log('Mimetype valid:', mimetype);
  
  if (extname && mimetype) {
    console.log('✓ File accepted');
    return cb(null, true);
  } else {
    console.log('✗ File rejected');
    cb(new Error("Only image files are allowed!"));
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

// POST /api/upload
// Accepts multipart/form-data with a single image file under the "file" field
router.post("/", (req, res, next) => {
  console.log('=== UPLOAD REQUEST START ===');
  console.log('Content-Type:', req.headers['content-type']);
  console.log('Content-Length:', req.headers['content-length']);
  
  upload.single("file")(req, res, (err) => {
    console.log('=== MULTER CALLBACK ===');
    if (err) {
      console.error('Multer/Cloudinary error:', err);
      console.error('Error message:', err.message);
      console.error('Error code:', err.http_code);
      return res.status(400).json({ message: `Upload error: ${err.message || 'Unknown error'}` });
    }

    console.log('File received:', !!req.file);
    if (req.file) {
      console.log('File details:', {
        fieldname: req.file.fieldname,
        originalname: req.file.originalname,
        size: req.file.size,
        mimetype: req.file.mimetype,
        path: req.file.path,
        location: req.file.location,
      });
    }

    if (!req.file) {
      console.warn('No file in request');
      return res.status(400).json({ message: "No image file uploaded" });
    }

    // Return the Cloudinary URL
    const url = req.file.path || req.file.location;
    if (!url) {
      console.error('No URL found:', req.file);
      return res.status(500).json({ message: 'Upload completed but URL not available' });
    }

    console.log('=== UPLOAD SUCCESS ===');
    console.log('URL:', url);
    res.json({ url });
  });
});

export default router;
