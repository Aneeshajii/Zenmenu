const { Admin } = require('../db/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        const admin = await Admin.findOne({ username });

        if (admin && (await bcrypt.compare(password, admin.password))) {
            const token = jwt.sign({ id: admin.id }, process.env.JWT_SECRET || 'fallback_secret', {
                expiresIn: '30d'
            });
            res.json({ token, username: admin.username });
        } else {
            res.status(401).json({ message: 'Invalid username or password' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

module.exports = { login };
