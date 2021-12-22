const express = require('express');
const db = require("../connection");
const Router = express.Router();
const { validateToken } = require('../jwt');
const { leaderRole } = require('../middlewares/userRole');

// get all his members
Router.get("/members", validateToken, leaderRole, (req, res) => {
    const leaderId = req.userId;
    db.query("SELECT id,name,email FROM user WHERE role = 'M' AND leader_id = ?", leaderId, (err, result) => {
        if (err) res.send({ error: err });
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
        if (err) res.send({ error: err });
        else {
            res.send(result)
        }
    })
})


// assign clients to a member
Router.post("/assignClients", validateToken, leaderRole, (req, res) => {
    const memberId = req.body.memberId;
    const clients = req.body.clients;
    clients.map((client) => {
        db.query("INSERT INTO assigned_to (id_member,id_client) VALUES (?,?)", [memberId, client], (err, result) => {
            if (err) res.send({ error: err })
        })
    })
    res.send("Clients Added!");
})

module.exports = Router;