// USER QUERIES
const FIND_USER_FOR_LOGIN = `SELECT 
                                id, username, email, password
                            FROM users 
                            WHERE email=?`

const FIND_USER_BY_TOKEN = `SELECT username, email, password FROM users
                            JOIN tokens
                                ON users.id = tokens.user_id
                            WHERE tokens.token_text = ?`

const AUTH_USER = `SELECT users.id, users.username FROM users 
                        INNER JOIN tokens
                            ON tokens.user_id = users.id
                        WHERE tokens.token_text = ? AND tokens.user_id = ?`

const ADD_TOKEN_TO_USER = `INSERT INTO tokens
                                (token_text, issued_at, expires_at, user_id)
                                VALUES (?, ?, ?, ?)`

const UPDATE_USER = `UPDATE users SET
                        username = COALESCE(?, username),
                        email = COALESCE(?, email),
                        password = COALESCE(?, password)
                        WHERE id = ?`

const CREATE_USER = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)'
const DELETE_USER = 'DELETE FROM users WHERE id=?'
const LOGOUT_USER = 'DELETE FROM tokens WHERE token_text=?'

module.exports = {
    FIND_USER_FOR_LOGIN,
    AUTH_USER,
    ADD_TOKEN_TO_USER,
    CREATE_USER,
    UPDATE_USER,
    DELETE_USER,
    LOGOUT_USER,
    FIND_USER_BY_TOKEN
}