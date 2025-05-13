import multer from 'multer'; // Multer handles file uploads
import path from 'path'; // A node.js module for working with file paths
import fs from 'fs'; // File system module to create directories

// Define where profile images will be stored
const uploadPath = 'server/public/uploads/profile';

// Ensure the folder exists (recursive: true creates nested folders if they don't exist)
fs.mkdirSync(uploadPath, { recursive: true });

// Multer storage engine configuration
const storage = multer.diskStorage({
  // Set the destination folder for the uploaded file
  destination(req, file, cb) {
    cb(null, uploadPath); // Save files to /public/uploads/profile
  },

  // Customize the uploaded file's name to make it unique
  filename(req, file, cb) {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname); //preserve the original extension
    cb(null, `user-${req.user._id}-${uniqueSuffix}${ext}`);
  },
});

// File filter to allow only JPEG and PNG images
const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png/;
  const ext = path.extname(file.originalname).toLowerCase();
  const mime = file.mimetype;

  if (allowed.test(ext) && allowed.test(mime)) {
    cb(null, true); // Accept file
  } else {
    cb(new Error('Only JPEG and PNG images are allowed')); // Reject file
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limites: { fileSize: 5 * 1024 * 1024 }, // Max file size = 5MB
});
