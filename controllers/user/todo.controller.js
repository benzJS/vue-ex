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

module.exports.put = async function(req, res, next) {
    if(req.decoded.id === Number(req.params.id)) {
        const { todos } = req.body;
        const newtodos = low.db.get('users').map(item => {
            if(item.id === Number(req.params.id)) item.todos = todos;
            return item;
        }).write();
        return res.json({
            success: true,
            message: 'Update todos successful'
        });
    }
    res.json({
        success: false,
        message: 'You can only modify your data'
    });
}