const { MenuItem } = require('../db/database');

const getAllMenu = async (req, res) => {
    try {
        const items = await MenuItem.find({ isAvailable: 1 });
        res.json(items);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getMenuByCategory = async (req, res) => {
    try {
        const { category } = req.params;
        const query = category.toLowerCase() === 'all' 
            ? { isAvailable: 1 } 
            : { category, isAvailable: 1 };
        
        const items = await MenuItem.find(query);
        res.json(items);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getAllMenuAdmin = async (req, res) => {
    try {
        const items = await MenuItem.find({});
        res.json(items);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const addMenuItem = async (req, res) => {
    try {
        const { name, price, category, type, description } = req.body;
        // Cloudinary stores the full absolute URL in req.file.path
        let image = req.file ? req.file.path : '';

        if (!name || !price || !category) {
            return res.status(400).json({ message: 'Name, price, and category are required' });
        }

        const newItem = await MenuItem.create({
            name, price, category, image, type, description, isAvailable: 1
        });

        res.status(201).json(newItem);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const updateMenuItem = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = { ...req.body };

        if (req.file) {
            updateData.image = req.file.path;
        }

        const updatedItem = await MenuItem.findByIdAndUpdate(id, updateData, { new: true });
        
        if (!updatedItem) return res.status(404).json({ message: 'Menu item not found' });
        res.json({ message: 'Menu item updated', item: updatedItem });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const deleteMenuItem = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedItem = await MenuItem.findByIdAndDelete(id);
        
        if (!deletedItem) return res.status(404).json({ message: 'Menu item not found' });
        res.json({ message: 'Menu item deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { getAllMenu, getMenuByCategory, getAllMenuAdmin, addMenuItem, updateMenuItem, deleteMenuItem };
