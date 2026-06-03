const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { getAllMenu, getMenuByCategory, getAllMenuAdmin, addMenuItem, updateMenuItem, deleteMenuItem } = require('../controllers/menuController');
const { protect } = require('../middleware/authMiddleware');

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'public/uploads/');
    },
    filename(req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const upload = multer({ storage });

// Public routes
router.get('/', getAllMenu);
router.get('/category/:category', getMenuByCategory);

// Admin routes (Protected)
router.get('/admin', protect, getAllMenuAdmin);
router.post('/', protect, upload.single('image'), addMenuItem);
router.put('/:id', protect, upload.single('image'), updateMenuItem);
router.delete('/:id', protect, deleteMenuItem);

module.exports = router;
