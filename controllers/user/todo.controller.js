const low = require('../../db');

module.exports.get = async function(req, res, next) {
    if(req.decoded.id === Number(req.params.id)) {
        const user = await low.db.get('users').find({id: Number(req.params.id)}).value();
        const { id, todos } = user;
        res.json({
            success: true,
            message: 'Get user data successful',
            data: { id, todos }
        });
        return;
    }
    res.status(403).json({
        success: false,
        message: 'You can only get your data'
    })
}