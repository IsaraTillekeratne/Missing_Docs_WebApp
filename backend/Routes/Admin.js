const express = require('express');
const db = require("../connection");
const Router = express.Router();
const { validateToken } = require('../jwt');
const { adminRole } = require('../middlewares/userRole');

// display all users
Router.get("/allUsers", validateToken, adminRole, (req, res) => {
    db.query("SELECT id,name,email,role FROM user", (err, result) => {
        if (err) res.send({ error: err })
        else {
            res.send(result);
        }
    })
});

// change a user role -> incomplete
Router.put("/changeRole", validateToken, adminRole, (req, res) => {
    const role = req.body.userRole;
    const id = req.body.userId;
    db.query("UPDATE user SET role = ? WHERE id = ?", [role, id], (err, result) => {
        if (err) res.send({ error: err })
        else {
            res.send('User role updated');
        }
    })
});

// get leader id, name, email
Router.get("/leaders", validateToken, adminRole, (req, res) => {
    db.query("SELECT id,name,email FROM user where role = 'L'", (err, result) => {
        if (err) res.send({ error: err })
        else {
            res.send(result);
        }
    })
});

// get unassigned member id, name, email
Router.get("/unassignedMembers", validateToken, adminRole, (req, res) => {
    db.query("SELECT id,name,email FROM user where role = 'M' AND leader_id is NULL", (err, result) => {
        if (err) res.send({ error: err })
        else {
            res.send(result);
        }
    })
});

// create a team
Router.put("/createTeam", validateToken, adminRole, (req, res) => {
    const leaderId = req.body.leaderId;
    const members = req.body.members;
    db.query("UPDATE user SET leader_id = ? WHERE id = ?", [leaderId, leaderId], (err, result) => {
        if (err) res.send({ error: err })
        else {
            members.map((member) => {
                db.query("UPDATE user SET leader_id = ? WHERE id = ?", [leaderId, member], (err, result) => {
                    if (err) res.send({ error: err })
                })
            })
            res.send('Team Created!')
        }
    })

})

module.exports = Router;