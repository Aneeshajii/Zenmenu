const db = require('../db/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const login = (req, res) => {
    const { username, password } = req.body;

    db.get(`SELECT * FROM admins WHERE username = ?`, [username], async (err, admin) => {
        if (err) {
            return res.status(500).json({ message: 'Server error' });
        }

        if (admin && (await bcrypt.compare(password, admin.password))) {
            const token = jwt.sign({ id: admin.id }, process.env.JWT_SECRET || 'fallback_secret', {
                expiresIn: '30d'
            });
            res.json({ token, username: admin.username });
        } else {
            res.status(401).json({ message: 'Invalid username or password' });
        }
    });
};

module.exports = { login };
