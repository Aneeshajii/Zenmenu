const express = require('express');
const router = express.Router();
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

const { getAllMenu, getMenuByCategory, getAllMenuAdmin, addMenuItem, updateMenuItem, deleteMenuItem } = require('../controllers/menuController');
const { protect } = require('../middleware/authMiddleware');

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'zenmenu_uploads',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp']
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
