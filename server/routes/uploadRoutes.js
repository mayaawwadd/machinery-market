// routes/uploadRoutes.js
import express from 'express';
import path from 'path';
import { upload } from '../middleware/uploadMiddleware.js';
import { protect } from '../middleware/authMiddleware.js'; // your JWT auth

const router = express.Router();

// now /api/upload/profile will run `protect` first:
router.post(
    '/upload/profile',
    protect,
    upload.single('image'),
    (req, res) => {
        // req.user._id is now defined
        if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
        const publicUrl = `/uploads/profile/${req.file.filename}`;
        res.json({ url: publicUrl });
    }
);

export default router;
