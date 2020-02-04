const routes = require('express').Router();
const bcrypt = require('bcryptjs');
const _ = require('lodash');

const db = require('../../database/database');
const { userValidationRules, validateUser } = require('../../validators/user-validator');
const { checkBodyParams } = require('../../middleware/utils');
const { validateAuthToken } = require('../../middleware/auth');
const { generateAuthToken } = require('../../utils/auth');
const {
    CREATE_USER,
    FIND_USER_FOR_LOGIN,
    ADD_TOKEN_TO_USER,
    UPDATE_USER,
    DELETE_USER,
    LOGOUT_USER,
    FIND_USER_BY_TOKEN
} = require('../../database/SQLqueries');


// CREATE USER
routes.post('/users', userValidationRules(), validateUser, checkBodyParams(['email', 'password', 'username']), async (req, res) => {

    try {
        const hash = await bcrypt.hash(req.body.password, 10);
        const data = {
            username: req.body.username,
            email: req.body.email,
            password: hash
        }

        const params = [data.username, data.email, data.password];
        db.run(CREATE_USER, params, async function (error, result) {
            if (error) {
                return res.status(400).json({ error: error.message });
            }

            const tokenData = await generateAuthToken(this.lastID);

            db.run(
                ADD_TOKEN_TO_USER,
                [tokenData.token, tokenData.issuedAt, tokenData.expiresAt, this.lastID],
                function (err) {
                    if (err) return res.status(400).json({ error: err.message });
                }
            )

            return res.json({ 
                message: "Success", 
                data: _.omit(data, 'password'), 
                id: this.lastID,
                token: tokenData.token
            });
        })
    } catch (error) {
        return res.status(400).json({ error });
    }
})

// UPDATE USER
routes.patch('/users/:id', validateAuthToken, checkBodyParams(['password']), (req, res) => {
    try {
        db.get(
            FIND_USER_BY_TOKEN,
            req.token,
            async function(error, user) {
                if (error) return res.status(400).json({ error: err.message });

                const isMatch = await bcrypt.compare(req.body.password, user.password);
                if (!isMatch) return res.status(400).json({ error: 'Incorrect password' });
        
                const hash = req.body.new_password ? bcrypt.hashSync(req.body.new_password, 10) : undefined
        
                const data = {
                    username: req.body.username,
                    email: req.body.email,
                    new_password: hash
                }
        
                db.run(
                    UPDATE_USER,
                    [data.username, data.email, data.new_password, req.params.id],
                    function (err) {
                        if (err) return res.status(400).json({ error: err.message });
                        if (!this.changes) return res.status(400).json({ error: "The user was not found" });
        
                        return res.json({ message: 'Success', data, changes: this.changes });
                    }
                )
            }
        )


    } catch (error) {
        return res.status(400).json(error);
    }
})

// DELETE USER
routes.delete('/users/:id', validateAuthToken, (req, res) => {
    if (req.decoded.id !== req.params.id) {
        return res.status(403).json({error: "You are not allowed to delete this account"})
    }

    db.run(
        DELETE_USER,
        req.params.id,
        function (err) {
            if (err) return res.status(400).json({ error: err.message });
            if (!this.changes) return res.status(400).json({ error: "The user was not found" });

            return res.json({ message: "Success", changes: this.changes });
        }
    )
})

// LOGIN USER
routes.post('/users/login', checkBodyParams(['email', 'password']), async (req, res) => {
    db.get(
        FIND_USER_FOR_LOGIN,
        req.body.email,
        async function (err, user) {
            if (!user) return res.status(400).json({ error: 'Incorrect credentials' });
            if (err) return res.status(400).json({ error: err.message });

            try {
                const isMatch = await bcrypt.compare(req.body.password, user.password);

                if (!isMatch) return res.status(400).json({ error: 'Incorrect credentials' });

                const tokenData = await generateAuthToken(user.id);

                db.run(
                    ADD_TOKEN_TO_USER,
                    [tokenData.token, tokenData.issuedAt, tokenData.expiresAt, user.id],
                    function (err) {
                        if (err) return res.status(400).json({ error: err.message });

                        return res.json({
                            message: "Success, logged in",
                            user: _.omit(user, 'password'),
                            token: tokenData.token
                        })
                    }
                )
            } catch (error) {
                return res.status(400).json({ error });
            }
        }
    )
})

// LOGOUT USER
routes.post('/users/logout', validateAuthToken, async (req, res) => {
    try {
        db.run(
            LOGOUT_USER,
            req.token,
            function(error) {
                if (error) return res.status(400).json({ error: error.message });
                if (!this.changes) return res.status(400).json({ error: "The user was not found" });

                return res.json({
                    message: "Success, logged out",
                    user: req.user,
                    changes: this.changes
                })
            }
        )
    } catch(error) {
        return res.status(400).json({error})
    }
})

module.exports = routes