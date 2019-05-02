require('dotenv').config();

const jwt = require('jsonwebtoken');

module.exports.checkToken = function(req, res, next) {
    const token = req.headers['x-access-token'];
    if(token) {
        try {
            const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
            req.decoded = decoded;
            next();
        } catch(err) {
            console.log(err);
            res.status(403).json({
                success: false,
                message: 'Invalid token'
            })
        }
    }
}