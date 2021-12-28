const express = require('express');
const db = require("../connection");
const Router = express.Router();
const { validateToken } = require('../jwt');
const { leaderRole } = require('../middlewares/userRole');

// get all his members
Router.get("/members", validateToken, leaderRole, (req, res) => {
    const leaderId = req.userId;
    db.query("SELECT id,name,email FROM user WHERE role = 'M' AND leader_id = ?", leaderId, (err, result) => {
        if (err) res.status(400).send({ error: 'Bad request!' })
        else {
            res.send(result)
        }
    })
})

// get all clients (ones not assigned to the current member)
Router.get("/clients", validateToken, leaderRole, (req, res) => {
    const memberId = req.query.memberId;
    const query = "SELECT id,name,email FROM user WHERE role = 'C' AND id NOT IN(SELECT DISTINCT id_client FROM assigned_to WHERE id_member = ?)"
    db.query(query, memberId, (err, result) => {
        if (err) res.status(400).send({ error: 'Bad request!' })
        else {
            res.send(result)
        }
    })
})

// get all clients of his team members
Router.get("/assignedClients", validateToken, leaderRole, (req, res) => {
    const leaderId = req.userId;
    const query = "SELECT id,name,email FROM user WHERE id IN(SELECT DISTINCT id_client FROM assigned_to WHERE id_member IN(SELECT id FROM user WHERE role = 'M' AND leader_id = ?))"
    db.query(query, leaderId, (err, result) => {
        if (err) res.status(400).send({ error: 'Bad request!' })
        else {
            res.send(result);
        }
    })
})


// assign clients to a member
Router.post("/assignClients", validateToken, leaderRole, (req, res) => {
    const memberId = req.body.memberId;
    const clients = req.body.clients;
    // check if this member belongs to this leader
    db.query("SELECT leader_id FROM user where id = ?", memberId, (err, result) => {
        if (err) res.status(400).send({ error: 'Bad request!' })
        else {
            if (result[0].leader_id === req.userId) {
                clients.map((client) => {
                    db.query("INSERT INTO assigned_to (id_member,id_client) VALUES (?,?)", [memberId, client], (err, result) => {
                        if (err) res.status(400).send({ error: 'Bad request!' })
                    })
                })
                res.send("Clients Added!");
            } else {
                res.status(400).send({ error: 'No access to requested team member data' })
            }
        }
    })

})

// get requests of a client (sent only by his members)
Router.get("/requests", validateToken, leaderRole, (req, res) => {
    const type = req.query.type; // Actual or Provided
    const leaderId = req.userId;
    const clientId = req.query.clientId;
    // get ids of his members
    db.query("SELECT id FROM user WHERE role = 'M' AND leader_id = ?", leaderId, (err, results) => {
        if (err) res.status(400).send({ error: 'Bad request!' })
        else {
            let memberIds = [];
            results.map((result) => {
                memberIds.push(result.id);
            })
            // get requestids from sent
            db.query("SELECT requestid FROM sent WHERE clientid = ? AND type = ? AND memberid IN (?)", [clientId, type, memberIds], (err, result) => {
                if (err) res.status(400).send({ error: 'Bad request!' })
                else {
                    if (result.length === 0) res.send([]);
                    // remove null requestids
                    let nullIdIndexes = [];
                    for (let i = 0; i < result.length; i++) {
                        if (result[i].requestid === null) nullIdIndexes.push(i);
                    }

                    for (var i = nullIdIndexes.length - 1; i >= 0; i--) {
                        result.splice(nullIdIndexes[i], 1);
                    }
                    const len = result.length
                    let reqs = [];
                    let index = 0;
                    result.map((request) => {
                        db.query("SELECT id,doc_date,placed_date,amount,partner,comments FROM request WHERE id = ?", request.requestid, (err, queryRes) => {
                            if (err) res.status(400).send({ error: 'Bad request!' })
                            else {
                                reqs.push(queryRes[0]);
                                if (index === len - 1) res.send(reqs);
                                else index = index + 1;

                            }
                        })
                    })

                }
            })
        }
    })
})

// mark as not provided
Router.put("/unMark", validateToken, leaderRole, (req, res) => {
    const reqId = req.body.reqId;
    db.query("UPDATE sent SET type = 'A' WHERE requestid = ?", reqId, (err, result) => {
        if (err) res.status(400).send({ error: 'Bad request!' })
        else res.send("Marked as not provided!");
    })
});

// get document for a request
Router.get("/document", validateToken, leaderRole, (req, res) => {
    const reqId = req.query.reqId;
    db.query("SELECT document FROM sent WHERE requestid = ?", reqId, (err, result) => {
        if (err) res.status(400).send({ error: 'Bad request!' })
        else {
            res.send(result);
        }
    })
});

// file download
Router.get("/download", validateToken, leaderRole, (req, res) => {
    const fileName = req.query.fileName;
    const path = __dirname + "/uploads/" + fileName;

    res.sendFile(path, (err) => {
        console.log(err)
        //res.status(400).send({ error: 'Bad request!' })
    });

})

module.exports = Router;