const express = require('express');
const db = require("../connection");
const Router = express.Router();
const { validateToken } = require('../jwt');
const { clientRole } = require('../middlewares/userRole');
const { getRequests } = require('../helpers/requests')

// get his Actual requests same as MEMBERS end point
Router.get("/requests", validateToken, clientRole, (req, res) => {
    const clientId = req.userId;
    db.query("SELECT requestid,memberid FROM sent WHERE clientid = ? AND type = 'A'", [clientId], (err, results) => {
        if (err) res.status(400).send({ error: 'Bad request!' })
        else {
            if (results.length === 0) res.send([]);
            else {
                const requests = getRequests(...results);
                requests.then((response) => {
                    res.send(response);
                }).catch((err) => {
                    res.status(400).send({ error: 'Bad request!' })
                })
            }
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
    db.query("SELECT requestid,memberid FROM sent WHERE clientid = ? AND type = 'P'", [clientId], (err, results) => {
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

// get members who sent requests to this client
Router.get("/myMembers", validateToken, clientRole, (req, res) => {
    const id = req.userId;
    db.query("SELECT DISTINCT id_member FROM assigned_to WHERE id_client = ?", id, (err, result) => {
        if (err) res.status(400).send({ error: 'Bad request!' })
        else {

            if (result.length === 0) res.send([]);
            else {
                // remove null memberids
                let nullIdIndexes = [];
                for (let i = 0; i < result.length; i++) {
                    if (result[i].id_member === null) nullIdIndexes.push(i);
                }

                for (var i = nullIdIndexes.length - 1; i >= 0; i--) {
                    result.splice(nullIdIndexes[i], 1);
                }
                const len = result.length

                let members = [];
                let index = 0;
                result.map((member) => {
                    db.query("SELECT id,name,email FROM user WHERE id = ?", member.id_member, (err, queryRes) => {
                        if (err) res.status(400).send({ error: 'Bad request!' })
                        else {
                            members.push(queryRes[0]);
                            if (index === len - 1) res.send(members);
                            else index = index + 1;

                        }
                    })
                })
            }
        }
    })
})

module.exports = Router;