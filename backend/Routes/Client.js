const express = require('express');
const db = require("../connection");
const Router = express.Router();
const { validateToken } = require('../jwt');
const { clientRole } = require('../middlewares/userRole');
const { getRequests } = require('../helpers/requests')

// get his requests same as MEMBERS end point
Router.get("/requests", validateToken, clientRole, (req, res) => {
    const clientId = req.userId;
    db.query("SELECT requestid FROM sent WHERE clientid = ? AND type = 'A'", [clientId], (err, results) => {
        if (err) res.sendStatus(400);
        else {

            const requests = getRequests(...results);
            requests.then((response) => {
                res.send(response);
            }).catch((err) => {
                res.sendStatus(400);
            })

        }
    })
})

module.exports = Router;