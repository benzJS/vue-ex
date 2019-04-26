const app = require('../app');
const db = app['db'];

module.exports.get = function(req, res) {
    // console.log(db);
    const query = `
        SELECT * FROM users
    `
    app.db.query(query, function(err, users, fields) {
        res.status(200).json({
            success: true,
            data: users
        });
    });
}