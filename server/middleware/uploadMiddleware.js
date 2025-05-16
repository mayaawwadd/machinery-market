import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Compute __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Factory to create a Multer uploader for different file types
 */
function makeUploader({ subfolder, filePrefix, allowedExt, maxSize }) {
  // build absolute path to upload directory
  const uploadDir = path.join(__dirname, '../public/uploads', subfolder);
  fs.mkdirSync(uploadDir, { recursive: true });

  const storage = multer.diskStorage({
    destination(req, file, cb) {
      cb(null, uploadDir);
    },
    filename(req, file, cb) {
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      const ext = path.extname(file.originalname).toLowerCase();
      cb(null, `${filePrefix}-${req.user._id}-${uniqueSuffix}${ext}`);
    },
  });

  const fileFilter = (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const ok = allowedExt.test(ext) || allowedExt.test(file.mimetype);
    cb(ok ? null : new Error(`Only files matching ${allowedExt} allowed`), ok);
  };

  return multer({ storage, fileFilter, limits: { fileSize: maxSize } });
}

// Profile image uploader: accept JPEG/PNG up to 5MB
export const uploadProfileImage = makeUploader({
  subfolder: 'profile',
  filePrefix: 'user',
  allowedExt: /\.(jpe?g|png)$/i,
  maxSize: 5 * 1024 * 1024,
});

// Invoice uploader: accept PDF/JPEG/PNG up to 10MB
export const uploadInvoice = makeUploader({
  subfolder: 'invoices',
  filePrefix: 'invoice',
  allowedExt: /\.(pdf|jpe?g|png)$/i,
  maxSize: 10 * 1024 * 1024,
});

// Machinery image uploader: accept JPEG/PNG up to 10MB
export const uploadMachineryImage = makeUploader({
  subfolder: 'machinery',
  filePrefix: 'machinery',
  allowedExt: /\.(jpe?g|png)$/i,
  maxSize: 10 * 1024 * 1024,
});

// Machinery video uploader: accept MP4/MOV/AVI/MKV up to 10MB
export const uploadVideo = makeUploader({
  subfolder: 'videos',
  filePrefix: 'video',
  // allow mp4, mov, avi, mkv
  allowedExt: /\.(mp4|mov|avi|mkv)$/i,
  // e.g. max 50 MB
  maxSize: 50 * 1024 * 1024,
});

