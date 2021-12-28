const express = require('express');
const db = require("../connection");
const Router = express.Router();
const bcrypt = require('bcrypt');
const { createToken } = require('../jwt');
const validation = require('../middlewares/validationMiddleware')
const signinSchema = require('../validations/signinValidation');

const saultRounds = 10;

Router.post("/", validation(signinSchema), async function (req, res) {


    const email = req.body.userEmail;
    const password = req.body.userPassword;

    db.query("SELECT * FROM user WHERE email = ?",
        email,
        (err, result) => {
            if (err) {
                res.status(400).send({ error: "Bad request!" });

            }
            if (result.length > 0) {
                bcrypt.compare(password, result[0].password).then((match) => {
                    if (match) {

                        const id = result[0].id;
                        const role = result[0].role;
                        const token = createToken(id, role);
                        res.send({ auth: true, token: token, name: result[0].name });

                    }
                    else {
                        res.status(401).send({ error: "Incorrect password" });

                    }
                })
            }
            else {
                res.status(401).send({ error: "User doesn't exist" });

            }
        });

});



module.exports = Router;