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

// upload and send new requests
Router.post("/sendRequests", validateToken, memberRole, (req, res) => {
    const memberId = req.userId;
    const clientId = req.body.clientId;
    const requests = req.body.requests;
    const placed_date = ((new Date(Date.now()).toLocaleString()).split(','))[0];

    // upload to requests table
    requests.map((request) => {
        db.query("INSERT INTO request (doc_date,amount,partner,comments,placed_date,member_id) VALUES (?,?,?,?,?,?)",
            [request[0], request[1], request[2], request[3], placed_date, memberId], (err, result) => {
                if (err) res.send({ error: err });
                else {
                    // send to client
                    let requestId = result.insertId;
                    db.query("INSERT INTO sent (memberid,clientid,requestid,type) VALUES (?,?,?,?)",
                        [memberId, clientId, requestId, 'A'], (err, result) => {
                            if (err) res.send({ error: err });
                        })
                }
            })
    })

    res.send("Requests sent successfully!");

})


module.exports = Router;