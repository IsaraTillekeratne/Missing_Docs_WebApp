const express = require('express');
const db = require("../connection");
const Router = express.Router();
const bcrypt = require('bcrypt');
const validation = require('../middlewares/validationMiddleware')
const signupSchema = require('../validations/signupValidation');

const saultRounds = 10;

Router.post("/", validation(signupSchema), function (req, res) {

    const name = req.body.userName;
    const email = req.body.userEmail;
    const password = req.body.userPassword;

    db.query("SELECT * FROM user WHERE email = ?",
        [email],
        (err, result) => {
            if (err) {
                res.status(400).send({ error: err });

            }
            if (result.length > 0) {
                res.send({ error: 'Username already exists' });

            }
            else {

                // succesfull signup 

                // hash password
                bcrypt.hash(password, saultRounds, (err, hash) => {

                    if (err) console.log(err);

                    db.query("INSERT INTO user (name, email,password) VALUES (?,?,?)",
                        [name, email, hash],
                        (err, result) => {
                            if (err) {
                                res.status(400).send({ error: err });

                            }
                            else {
                                res.send({ message: 'successful' });

                            }

                        });


                })



            }
        });
});

module.exports = Router;