const db = require('../db/database');

const getAllMenu = (req, res) => {
    db.all(`SELECT * FROM menu_items WHERE isAvailable = 1`, [], (err, rows) => {
        if (err) return res.status(500).json({ message: err.message });
        res.json(rows);
    });
};

const getMenuByCategory = (req, res) => {
    const { category } = req.params;
    const query = category.toLowerCase() === 'all' 
        ? `SELECT * FROM menu_items WHERE isAvailable = 1`
        : `SELECT * FROM menu_items WHERE category = ? AND isAvailable = 1`;
        
    const params = category.toLowerCase() === 'all' ? [] : [category];

    db.all(query, params, (err, rows) => {
        if (err) return res.status(500).json({ message: err.message });
        res.json(rows);
    });
};

const getAllMenuAdmin = (req, res) => {
    db.all(`SELECT * FROM menu_items`, [], (err, rows) => {
        if (err) return res.status(500).json({ message: err.message });
        res.json(rows);
    });
};

const addMenuItem = (req, res) => {
    const { name, price, category, type, description } = req.body;
    let image = req.file ? `/uploads/${req.file.filename}` : '';

    if (!name || !price || !category) {
        return res.status(400).json({ message: 'Name, price, and category are required' });
    }

    db.run(
        `INSERT INTO menu_items (name, price, category, image, type, description) VALUES (?, ?, ?, ?, ?, ?)`,
        [name, price, category, image, type, description],
        function (err) {
            if (err) return res.status(500).json({ message: err.message });
            res.status(201).json({ id: this.lastID, name, price, category, image, type, description, isAvailable: 1 });
        }
    );
};

const updateMenuItem = (req, res) => {
    const { id } = req.params;
    const { name, price, category, type, description, isAvailable } = req.body;
    
    let query = `UPDATE menu_items SET name = ?, price = ?, category = ?, type = ?, description = ?, isAvailable = ?`;
    let params = [name, price, category, type, description, isAvailable];

    if (req.file) {
        query += `, image = ?`;
        params.push(`/uploads/${req.file.filename}`);
    }

    query += ` WHERE id = ?`;
    params.push(id);

    db.run(query, params, function (err) {
        if (err) return res.status(500).json({ message: err.message });
        if (this.changes === 0) return res.status(404).json({ message: 'Menu item not found' });
        res.json({ message: 'Menu item updated' });
    });
};

const deleteMenuItem = (req, res) => {
    const { id } = req.params;
    db.run(`DELETE FROM menu_items WHERE id = ?`, [id], function (err) {
        if (err) return res.status(500).json({ message: err.message });
        if (this.changes === 0) return res.status(404).json({ message: 'Menu item not found' });
        res.json({ message: 'Menu item deleted' });
    });
};

module.exports = { getAllMenu, getMenuByCategory, getAllMenuAdmin, addMenuItem, updateMenuItem, deleteMenuItem };
