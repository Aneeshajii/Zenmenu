require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const db = require('./db/database'); // Initialize DB

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'public/uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

const menuRoutes = require('./routes/menuRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (images)
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

app.use('/api/menu', menuRoutes);
app.use('/api/auth', authRoutes);

// Health check route for the root
app.get('/', (req, res) => {
    res.send('Zenmenu API is running! Please access the application through the Vercel frontend URL.');
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
