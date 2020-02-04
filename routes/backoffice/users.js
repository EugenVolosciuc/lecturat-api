const routes = require('express').Router();
const db = require('../../database/database');

// GET ALL USERS
routes.get('/users', (req, res) => {
    const sql = 'SELECT * FROM users';

    db.all(sql, [], (err, rows) => {
        if (err) {
            return res.status(400).json({err});
        }

        res.json({message: "Success", data: rows});
    });
})

// GET USER BY ID
routes.get('/users/:id', (req, res) => {
    const sql = 'SELECT * FROM users WHERE id=?';
    const params = [req.params.id]

    db.get(sql, params, (err, row) => {
        if (err) {
            return res.status(400).json({err});
        }

        res.json({message: "Success", data: row});
    })
})

module.exports = routes;
