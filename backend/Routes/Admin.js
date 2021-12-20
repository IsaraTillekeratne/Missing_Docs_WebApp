const express = require('express');
const db = require("../connection");
const Router = express.Router();
const { validateToken } = require('../jwt');
const { adminRole } = require('../middlewares/userRole');

Router.get("/allUsers", validateToken, adminRole, (req, res) => {
    db.query("SELECT id,name,email,role FROM user", (err, result) => {
        if (err) res.send({ error: err })
        else {
            res.send(result);
        }
    })
})

module.exports = Router;