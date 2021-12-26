const jwt = require("jsonwebtoken");
require('dotenv').config();

const jwtSecret = process.env.JWT_SECRET

const createToken = (id, role) => {
    const accessToken = jwt.sign({ id: id, role: role },
        jwtSecret,
        {
            expiresIn: 60 * 60 * 24 * 7,
        }
    );

    return accessToken;
};

const validateToken = (req, res, next) => {

    const token = req.headers["x-access-token"]
    if (!token) {
        res.send({ error: "User not authenticated!", auth: false });
        //res.sendStatus(401);
    }
    else {
        try {
            const validToken = jwt.verify(token, jwtSecret);
            req.userRole = validToken.role; // -> user who sent the request
            req.userId = validToken.id;
            if (validToken) {
                return next();
            }
        }
        catch (err) {
            res.json({ auth: false, error: 'Invalid Token' })
            //res.sendStatus(401);
        }

    }

}

module.exports = { validateToken, createToken };
