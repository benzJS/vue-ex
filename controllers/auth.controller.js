require('dotenv').config();

const low = require('../db');
const { db } = low;
const jwt = require('jsonwebtoken');

module.exports.signin = async function(req, res, next) {
    const { email, password } = req.body;
    if(!email || !password) {
        return res.status(400).json({
            success: false,
            message: 'Authentication failed! Please check the request'
        })
    }
    const user = await low.db.get('users').find({ email, password }).value();
    if(!user) {
        return res.status(403).json({
            success: false,
            message: 'Invalid email or password'
        })
    }
    const token = jwt.sign({ id: user.id, email: user.email, fullname: user.fullname }, process.env.TOKEN_SECRECT, {
        expiresIn: '15s'
    })
    return res.status(200).json({
        success: true,
        message: 'Sign in successfully',
        token
    })
}