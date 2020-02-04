const jwt = require('jsonwebtoken')

const generateAuthToken = async (id) => {
    const token = jwt.sign({id: id.toString()}, process.env.JWT_KEY, { expiresIn: '30 days'})
    const issuedAt = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const expiresAt = new Date(new Date(issuedAt).setDate(new Date(issuedAt).getDate() + 30)).toISOString().slice(0, 19).replace('T', ' ');

    const tokenData = {
        token,
        issuedAt,
        expiresAt
    }
    return tokenData
}

module.exports = {
    generateAuthToken
}