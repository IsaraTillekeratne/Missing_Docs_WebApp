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

Router.put("/uploadFile", validateToken, clientRole, (req, res) => {
    const reqId = req.query.reqId;
    if (!req.files || Object.keys(req.files).length === 0) {
        res.sendStatus(400);
    } else {
        const file = req.files.file;
        const fileName = 'REQ' + reqId + 'FILE' + file.name;
        file.mv(`${__dirname}/uploads/${fileName}`, err => {
            if (err) {
                console.log(err);
                res.sendStatus(500)
            }
            else {
                db.query("UPDATE sent SET document = ?, type = 'P' WHERE requestid = ?", [fileName, reqId], (err, result) => {
                    if (err) {
                        console.log(err);
                        res.sendStatus(400);
                    }
                    else res.send("Uploaded Successfully!");
                })
            }
        })

    }
})

module.exports = Router;