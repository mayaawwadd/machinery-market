// routes/uploadRoutes.js
import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { protect } from '../middleware/authMiddleware.js';
import {
    uploadProfileImage,
    uploadInvoice,
    uploadMachineryImage,
    uploadVideo
} from '../middleware/uploadMiddleware.js';

const router = express.Router();

// ESM __dirname shim
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// POST /api/upload/profile
router.post(
    '/upload/profile',
    protect,
    uploadProfileImage.single('image'),
    (req, res) => {
        if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
        res.status(201).json({ url: `/uploads/profile/${req.file.filename}` });
    }
);

// POST /api/upload/invoice
router.post(
    '/upload/invoice',
    protect,
    uploadInvoice.single('invoice'),
    (req, res) => {
        if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
        res.status(201).json({ url: `/uploads/invoices/${req.file.filename}` });
    }
);

// POST /api/upload/machinery
router.post(
    '/upload/machinery',
    protect,
    uploadMachineryImage.single('image'),
    (req, res) => {
        if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
        res.status(201).json({ url: `/uploads/machinery/${req.file.filename}` });
    }
);

// POST /api/upload/video
router.post(
    '/upload/video',
    protect,
    uploadVideo.single('video'),
    (req, res) => {
        if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
        res.status(201).json({ url: `/uploads/videos/${req.file.filename}` });
    }
);

// DELETE /api/upload/profile/:filename
router.delete(
    '/upload/machinery/:filename',
    protect,
    (req, res) => {
        const { filename } = req.params;
        const filePath = path.join(__dirname, '../public/uploads/machinery', filename);

        fs.unlink(filePath, err => {
            if (err) {
                console.error('unlink error:', err);
                return res.status(500).json({ message: 'Could not delete file' });
            }
            res.json({ message: 'File deleted' });
        });
    }
);

// DELETE /api/upload/invoice/:filename
router.delete(
    '/upload/invoice/:filename',
    protect,
    (req, res) => {
        const { filename } = req.params;
        const filePath = path.join(
            __dirname,
            '../public/uploads/invoices',
            filename
        );

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ message: 'File not found' });
        }

        fs.unlink(filePath, err => {
            if (err) {
                console.error('unlink error:', err);
                return res.status(500).json({ message: 'Could not delete file' });
            }
            res.json({ message: 'Invoice deleted' });
        });
    }
);

// DELETE /api/upload/video/:filename
router.delete(
    '/upload/video/:filename',
    protect,
    (req, res) => {
        const { filename } = req.params;
        const fp = path.join(__dirname, '../public/uploads/videos', filename);
        if (!fs.existsSync(fp)) return res.status(404).json({ message: 'Not found' });
        fs.unlink(fp, err => {
            if (err) return res.status(500).json({ message: 'Delete failed' });
            res.json({ message: 'Video deleted' });
        });
    }
);

export default router;
