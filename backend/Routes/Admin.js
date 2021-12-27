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

// get members  id, name, email (who has a team)
Router.get("/assignedMembers", validateToken, adminRole, (req, res) => {
    const leaderId = req.query.leaderId;
    db.query("SELECT id,name,email FROM user where role = 'M' AND leader_id = ?", leaderId, (err, result) => {
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

// delete a team
Router.put("/deleteTeam", validateToken, adminRole, (req, res) => {
    const leaderId = req.body.leaderId;
    db.query("UPDATE user SET leader_id = NULL WHERE leader_id = ?", leaderId, (err, result) => {
        if (err) res.send({ error: err })
        else res.send("Team Deleted!");
    })
})

// get all requests
Router.get("/requests", validateToken, adminRole, (req, res) => {
    db.query("SELECT id,doc_date,placed_date,amount,partner,comments FROM request", (err, result) => {
        if (err) res.sendStatus(400);
        else {
            res.send(result);
        }
    })
});

// get document for a request
Router.get("/document", validateToken, adminRole, (req, res) => {
    const reqId = req.query.reqId;
    db.query("SELECT document FROM sent WHERE requestid = ?", reqId, (err, result) => {
        if (err) res.sendStatus(400);
        else {
            res.send(result);
        }
    })
});

// file download
Router.get("/download", validateToken, adminRole, (req, res) => {
    const fileName = req.query.fileName;
    const path = "./Routes/uploads/" + fileName;
    try {
        res.download(path);
    } catch {
        res.sendStatus(400);
    }
})

module.exports = Router;