const low = require('../../db');

module.exports.get = async function(req, res) {
    // const query = `
    //     SELECT * FROM users
    // `
    if(req.decoded.id === Number(req.params.id)) {
        const user = await low.db.get('users').find({id: Number(req.params.id)}).value();
        res.json({
            success: true,
            message: 'Get user data successful',
            user
        });
        return;
    }
    res.status(403).json({
        success: false,
        message: 'You can only get your data'
    })
}
