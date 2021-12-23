const express = require('express');
const db = require("../connection");
const Router = express.Router();
const { validateToken } = require('../jwt');
const { memberRole } = require('../middlewares/userRole');

// get his clients
Router.get("/clients", validateToken, memberRole, (req, res) => {
    const memberId = req.userId;
    const query = "SELECT id,name,email FROM user WHERE role = 'C' AND id IN(SELECT DISTINCT id_client FROM assigned_to WHERE id_member = ?)"
    db.query(query, memberId, (err, result) => {
        if (err) res.send({ error: err });
        else {
            res.send(result);
        }
    })
})

// create new requests


module.exports = Router;