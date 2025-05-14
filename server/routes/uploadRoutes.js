// routes/uploadRoutes.js
import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { protect } from '../middleware/authMiddleware.js';
import {
    uploadProfileImage,
    uploadInvoice,
    uploadMachineryImage
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


export default router;
