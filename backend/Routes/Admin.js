const express = require('express');
const db = require("../connection");
const Router = express.Router();
const { validateToken } = require('../jwt');
const { adminRole } = require('../middlewares/userRole');

// display all users
Router.get("/allUsers", validateToken, adminRole, (req, res) => {
    db.query("SELECT id,name,email,role FROM user", (err, result) => {
        if (err) res.status(400).send({ error: 'Bad request!' })
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
        if (err) res.status(400).send({ error: 'Bad request!' })
        else {
            res.send('User role updated');
        }
    })
});

// get leader id, name, email
Router.get("/leaders", validateToken, adminRole, (req, res) => {
    db.query("SELECT id,name,email FROM user where role = 'L'", (err, result) => {
        if (err) res.status(400).send({ error: 'Bad request!' })
        else {
            res.send(result);
        }
    })
});

// delete a user
Router.delete("/deleteUser", validateToken, adminRole, (req, res) => {
    const id = req.query.id;
    db.query("DELETE FROM user WHERE id = ?", id, (err, result) => {
        if (err) res.status(400).send({ error: 'Bad request!' })
        else res.send("User Deleted!");
    })
})

// get unassigned member id, name, email
Router.get("/unassignedMembers", validateToken, adminRole, (req, res) => {
    db.query("SELECT id,name,email FROM user where role = 'M' AND leader_id is NULL", (err, result) => {
        if (err) res.status(400).send({ error: 'Bad request!' })
        else {
            res.send(result);
        }
    })
});

// get members  id, name, email (who has a team)
Router.get("/assignedMembers", validateToken, adminRole, (req, res) => {
    const leaderId = req.query.leaderId;
    db.query("SELECT id,name,email FROM user where role = 'M' AND leader_id = ?", leaderId, (err, result) => {
        if (err) res.status(400).send({ error: 'Bad request!' })
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
        if (err) res.status(400).send({ error: 'Bad request!' })
        else {
            members.map((member) => {
                db.query("UPDATE user SET leader_id = ? WHERE id = ?", [leaderId, member], (err, result) => {
                    if (err) res.status(400).send({ error: 'Bad request!' })
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
        if (err) res.status(400).send({ error: 'Bad request!' })
        else res.send("Team Deleted!");
    })
})

// get all requests
Router.get("/requests", validateToken, adminRole, (req, res) => {
    const type = req.query.type;
    db.query("SELECT requestid FROM sent WHERE type = ?", type, (err, result) => {
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

});

// get document for a request
Router.get("/document", validateToken, adminRole, (req, res) => {
    const reqId = req.query.reqId;
    db.query("SELECT document FROM sent WHERE requestid = ?", reqId, (err, result) => {
        if (err) res.status(400).send({ error: 'Bad request!' })
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
        res.status(400).send({ error: 'Bad request!' })
    }
})

module.exports = Router;