const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');

const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        
        db.run(`CREATE TABLE IF NOT EXISTS menu_items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            price REAL NOT NULL,
            category TEXT NOT NULL,
            image TEXT,
            type TEXT,
            description TEXT,
            isAvailable INTEGER DEFAULT 1
        )`);

        db.run(`CREATE TABLE IF NOT EXISTS admins (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL
        )`, async (err) => {
            if (!err) {
                // Seed a default admin if none exists
                db.get(`SELECT * FROM admins WHERE username = 'admin'`, async (err, row) => {
                    if (!row) {
                        const salt = await bcrypt.genSalt(10);
                        const hashedPassword = await bcrypt.hash('admin123', salt);
                        db.run(`INSERT INTO admins (username, password) VALUES (?, ?)`, ['admin', hashedPassword]);
                        console.log('Default admin created: admin / admin123');
                    }
                });
            }
        });
    }
});

module.exports = db;
