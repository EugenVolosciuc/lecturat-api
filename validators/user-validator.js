const { body, validationResult } = require('express-validator');

const userValidationRules = () => {
    return [
        body('email').isEmail().withMessage('The email is not valid'),
        body('password').isLength({ min: 6 }).withMessage('The password must have at least 6 characters')
    ]
}

const validateUser = (req, res, next) => {
    const errors = validationResult(req)
    if (errors.isEmpty()) {
        return next()
    }

    const extractedErrors = []
    errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }))

    return res.status(422).json({
        errors: extractedErrors
    })
}

module.exports = {
    userValidationRules,
    validateUser
}