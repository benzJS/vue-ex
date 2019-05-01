const low = require('../db');

module.exports.get = async function(req, res) {
    // console.log(db);
    const query = `
        SELECT * FROM users
    `
    const user = await low.db.get('users').find({id: Number(req.params.id)}).value();
    res.status(200).json({
        success: true,
        message: 'Get user data successfully',
        user
    });
    return;
}