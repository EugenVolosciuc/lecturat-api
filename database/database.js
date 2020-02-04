const path = require('path');
const dbPath = path.resolve(__dirname, 'reading_list.db');
const sqlite3 = require('sqlite3').verbose();

let db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (error) => {
    if (error) {
        return console.error(error.message);
    }
    db.get("PRAGMA foreign_keys = ON");
    console.log('Connected to the Reading List database');
});

module.exports = db;