const jwt = require('jsonwebtoken');
const db = require('../database/database')
const { AUTH_USER } = require('../database/SQLqueries')

const validateAuthToken = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_KEY);

        db.get(
            AUTH_USER,
            [token, decoded.id],
            function(error, user) {
                if (!user) return res.status(400).json({ error: 'Incorrect credentials' });
                if (error) return res.status(400).json({ error: err.message });

                req.token = token
                req.decoded = decoded
                req.user = user
                next()
            }
        )
        
    } catch (error) {
        res.status(401).json({error, message: 'Please authenticate'});
    }
}

module.exports = { validateAuthToken }