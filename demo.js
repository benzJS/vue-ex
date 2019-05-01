const jwt = require('jsonwebtoken');

// const token = jwt.sign({foo: 'bar'}, 'asdlk923', { expiresIn: '1s' });
const token = jwt.decode(
    `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFzZEBnbWFpbC5jb20iLCJmdWxsbmFtZSI6IkFub255bW91cyIsImlhdCI6MTU1NjcyOTE0NywiZXhwIjoxNTU2NzI5MTYyfQ.S95Rau-DRDSX0vHsVywPAGcAZ_Lme6WDuqvbBFDGHSk`
);

console.log(token);