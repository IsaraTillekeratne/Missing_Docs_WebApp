const express = require('express');
const db = require("../connection");
const Router = express.Router();
const { validateToken } = require('../jwt');
const { clientRole } = require('../middlewares/userRole');
const { getRequests } = require('../helpers/requests')

// get his Actual requests same as MEMBERS end point
Router.get("/requests", validateToken, clientRole, (req, res) => {
    const clientId = req.userId;
    db.query("SELECT requestid FROM sent WHERE clientid = ? AND type = 'A'", [clientId], (err, results) => {
        if (err) res.status(400).send({ error: 'Bad request!' })
        else {
            if (results.length === 0) res.send([]);
            const requests = getRequests(...results);
            requests.then((response) => {
                res.send(response);
            }).catch((err) => {
                res.status(400).send({ error: 'Bad request!' })
            })

        }
    })
})

// upload file
Router.put("/uploadFile", validateToken, clientRole, (req, res) => {
    const reqId = req.query.reqId;
    if (!req.files || Object.keys(req.files).length === 0) {
        res.status(400).send({ error: 'Bad request!' })
    } else {
        const file = req.files.file;
        file.name = 'REQ' + reqId + 'FILE' + file.name;
        const fileName = file.name;
        file.mv(`${__dirname}/uploads/${fileName}`, err => {
            if (err) {
                console.log(err);
                res.status(500).send({ error: 'Server error!' })
            }
            else {
                db.query("UPDATE sent SET document = ?, type = 'P' WHERE requestid = ?", [fileName, reqId], (err, result) => {
                    if (err) {
                        res.status(400).send({ error: 'Bad request!' })
                    }
                    else res.send("Uploaded Successfully!");
                })
            }
        })

    }
})

// mark as provided
Router.put("/mark", validateToken, clientRole, (req, res) => {
    const reqId = req.body.reqId;
    db.query("UPDATE sent SET type = 'P' WHERE requestid = ?", reqId, (err, result) => {
        if (err) res.status(400).send({ error: 'Bad request!' })
        else res.send("Marked as provided!");
    })
});

// get his Actual requests same as MEMBERS end point
Router.get("/requestsProvided", validateToken, clientRole, (req, res) => {
    const clientId = req.userId;
    db.query("SELECT requestid FROM sent WHERE clientid = ? AND type = 'P'", [clientId], (err, results) => {
        if (err) res.status(400).send({ error: 'Bad request!' })
        else {
            if (results.length === 0) res.send([]);
            const requests = getRequests(...results);
            requests.then((response) => {
                res.send(response);
            }).catch((err) => {
                res.status(400).send({ error: 'Bad request!' })
            })

        }
    })
})

module.exports = Router;