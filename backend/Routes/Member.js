const express = require('express');
const db = require("../connection");
const Router = express.Router();
const { validateToken } = require('../jwt');
const { memberRole } = require('../middlewares/userRole');
const { getRequests } = require('../helpers/requests')

// get his clients
Router.get("/clients", validateToken, memberRole, (req, res) => {
    const memberId = req.userId;
    const query = "SELECT id,name,email FROM user WHERE role = 'C' AND id IN(SELECT DISTINCT id_client FROM assigned_to WHERE id_member = ?)"
    db.query(query, memberId, (err, result) => {
        if (err) res.status(400).send({ error: 'Bad request!' })
        else {
            res.send(result);
        }
    })
})

// upload and send new requests
Router.post("/sendRequests", validateToken, memberRole, (req, res) => {
    const memberId = req.userId;
    const clientId = req.body.clientId;
    const requests = req.body.requests;
    const placed_date = ((new Date(Date.now()).toLocaleString()).split(','))[0];

    // if possible - check if this client belongs to this member

    // upload to requests table
    requests.map((request) => {
        db.query("INSERT INTO request (doc_date,amount,partner,comments,placed_date,member_id) VALUES (?,?,?,?,?,?)",
            [request[0], request[1], request[2], request[3], placed_date, memberId], (err, result) => {
                if (err) res.status(400).send({ error: 'Bad request!' })
                else {
                    // send to client
                    let requestId = result.insertId;
                    db.query("INSERT INTO sent (memberid,clientid,requestid,type) VALUES (?,?,?,?)",
                        [memberId, clientId, requestId, 'A'], (err, result) => {
                            if (err) res.status(400).send({ error: 'Bad request!' })
                        })
                }
            })
    })

    res.send("Requests sent successfully!");
})

// get requests (sent only by this member) of one of this member's client
Router.get("/requests", validateToken, memberRole, (req, res) => {
    const clientId = req.query.clientId;
    const memberId = req.userId;
    const type = req.query.type;
    // find requestids for the given pair of member-client
    db.query("SELECT requestid,document FROM sent WHERE clientid = ? AND memberid = ? AND type = ?", [clientId, memberId, type], (err, results) => {
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

// delete a request -> sent table eken request eka delete wenne na
Router.delete("/deleteRequest", validateToken, memberRole, (req, res) => {
    const reqId = req.query.requestId;
    db.query("DELETE FROM request WHERE id = ? AND member_id = ?", [reqId, req.userId], (err, result) => {
        if (err) res.status(400).send({ error: 'Bad request!' })
        else res.send("Successfully deleted!")
        // note if a diff mem tries to delete although it shows succesful msg, the request won't be deleted
    })
})

// edit request details
Router.put("/editRequest", validateToken, memberRole, (req, res) => {
    const reqId = req.body.reqId;
    const doc_date = req.body.doc_date;
    const amount = req.body.amount;
    const partner = req.body.partner;
    const comments = req.body.comments;
    const memberId = req.userId;
    db.query("UPDATE request SET doc_date = ?, amount = ?, partner = ?, comments = ? WHERE member_id = ? AND id = ?",
        [doc_date, amount, partner, comments, memberId, reqId], (err, result) => {
            if (err) res.status(400).send({ error: 'Bad request!' })
            else res.send("Successfully updated");
        })
})

// mark as not provided
Router.put("/unMark", validateToken, memberRole, (req, res) => {
    const reqId = req.body.reqId;
    db.query("UPDATE sent SET type = 'A' WHERE requestid = ?", reqId, (err, result) => {
        if (err) res.status(400).send({ error: 'Bad request!' })
        else res.send("Marked as not provided!");
    })
});

module.exports = Router;