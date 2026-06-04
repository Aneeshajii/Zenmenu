const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB Atlas');

        // Seed a default admin if none exists
        const adminCount = await Admin.countDocuments({ username: 'admin' });
        if (adminCount === 0) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('admin123', salt);
            await Admin.create({ username: 'admin', password: hashedPassword });
            console.log('Default admin created: admin / admin123');
        }
    } catch (err) {
        console.error('MongoDB connection error:', err.message);
        process.exit(1);
    }
};

// Define Schemas
const menuItemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    image: { type: String },
    type: { type: String },
    description: { type: String },
    isAvailable: { type: Number, default: 1 }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Map _id to id for frontend compatibility
menuItemSchema.virtual('id').get(function() {
    return this._id.toHexString();
});

const adminSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

adminSchema.virtual('id').get(function() {
    return this._id.toHexString();
});

const MenuItem = mongoose.model('MenuItem', menuItemSchema);
const Admin = mongoose.model('Admin', adminSchema);

module.exports = { connectDB, MenuItem, Admin };
