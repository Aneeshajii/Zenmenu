require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { connectDB } = require('./db/database');

connectDB();

const menuRoutes = require('./routes/menuRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static uploads no longer needed (using Cloudinary)

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
