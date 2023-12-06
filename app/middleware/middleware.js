// JWT token
const jwt = require('jsonwebtoken');
const jwtKey = 'suresh';

function verify(req, res, next) {
    const tokenValidation = req.headers['authentication'];
    if (tokenValidation) {
        const validTokenD = tokenValidation;
        jwt.verify(validTokenD, jwtKey, (error, valid) => {
            if (error) {
                console.log('error::: ', error);
                res.send(403, { massage: "Authentication failed..." });
            } else { next(); }
        })
    } else {
        res.send(403, { massage: "Authentication not found error..." });
    }
};

module.exports = { verify };