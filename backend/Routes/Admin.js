const express = require('express');
const db = require("../connection");
const Router = express.Router();
const { validateToken } = require('../jwt');
const { adminRole } = require('../middlewares/userRole');
const mysqldump = require('mysqldump')

require('dotenv').config();

// display all users
Router.get("/allUsers", validateToken, adminRole, (req, res) => {
    db.query("SELECT id,name,email,role FROM user", (err, result) => {
        if (err) res.status(400).send({ error: 'Bad request!' })
        else {
            res.send(result);
        }
    })
});

// change a user role
Router.put("/changeRole", validateToken, adminRole, (req, res) => {
    const role = req.body.userRole;
    const id = req.body.userId;
    const currentRole = req.body.currentRole;

    // handle if current role is leader
    if (currentRole === 'Team Leader') {
        db.query("UPDATE user SET leader_id = NULL WHERE leader_id = ?", id, (err, result) => {
            if (err) res.status(400).send({ error: 'Bad request!' })
        })
    }
    // handle if current role is member
    else if (currentRole === 'Team Member') {
        db.query("UPDATE user SET leader_id = NULL WHERE id = ?", id, (err, result) => {
            if (err) res.status(400).send({ error: 'Bad request!' })
            else {
                // delete associated entries in assigned_to, request, sent
                db.query("DELETE FROM assigned_to WHERE id_member = ?", id, (err, result) => {
                    if (err) res.status(400).send({ error: 'Bad request!' })
                    else {
                        db.query("UPDATE request SET member_id = NULL WHERE member_id = ?", id, (err, result) => {
                            if (err) res.status(400).send({ error: 'Bad request!' })
                            else {
                                db.query("UPDATE sent SET memberid = NULL WHERE memberid = ?", id, (err, result) => {
                                    if (err) res.status(400).send({ error: 'Bad request!' })
                                })
                            }
                        })
                    }
                })
            }
        })
    }
    // handle if current role is client
    else if (currentRole === 'Client') {
        // delete/update entries from sent and assigned to, set leader_id to null
        db.query("DELETE FROM assigned_to WHERE id_client = ?", id, (err, result) => {
            if (err) res.status(400).send({ error: 'Bad request!' })
            else {
                db.query("UPDATE sent SET clientid = NULL WHERE clientid = ?", id, (err, result) => {
                    if (err) res.status(400).send({ error: 'Bad request!' })
                    else {
                        db.query("UPDATE user SET leader_id = NULL WHERE id = ?", id, (err, result) => {
                            if (err) res.status(400).send({ error: 'Bad request!' })
                        })
                    }
                })
            }
        })
    }

    // update role
    db.query("UPDATE user SET role = ? WHERE id = ?", [role, id], (err, result) => {
        if (err) res.status(400).send({ error: 'Bad request!' })
        else res.send("User role updated!");
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
    const role = req.query.userRole;
    // when a member is deleted, delete his requests
    if (role === 'Team Member') {
        db.query("DELETE FROM sent WHERE memberid = ?", id, (err, result) => {
            if (err) res.status(400).send({ error: 'Bad request!' })
            else {
                db.query("DELETE from request WHERE member_id = ?", id, (err, result) => {
                    if (err) res.status(400).send({ error: 'Bad request!' })
                })
            }
        })
    }
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
    const leaderId = req.query.leaderId;
    const type = req.query.type;
    // find this leaders members
    db.query("SELECT id FROM user WHERE role = 'M' AND leader_id = ?", leaderId, (err, members) => {
        if (err) res.status(400).send({ error: 'Bad request!' })
        let memberIds = [];
        members.map((member) => {
            memberIds.push(member.id);
        })
        if (memberIds.length === 0) res.send([]);
        else {
            db.query("SELECT requestid FROM sent WHERE type = ? AND memberid IN(?)", [type, memberIds], (err, result) => {
                if (err) res.status(400).send({ error: 'Bad request!' })
                else {
                    if (result.length === 0) res.send([]);
                    else {
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
                            db.query("SELECT id,doc_date,placed_date,amount,partner,comments,member_id FROM request WHERE id = ?", request.requestid, (err, queryRes) => {
                                if (err) res.status(400).send({ error: 'Bad request!' })
                                else {
                                    reqs.push(queryRes[0]);
                                    if (index === len - 1) res.send(reqs);
                                    else index = index + 1;

                                }
                            })
                        })
                    }

                }
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
    const path = __dirname + "/uploads/" + fileName;

    res.sendFile(path, (err) => {
        console.log(err)
        //res.status(400).send({ error: 'Bad request!' })
    });

})

// backup db
Router.get("/backupDB", validateToken, adminRole, (req, res) => {
    let password = process.env.DBPASSWORD;
    let database = process.env.DBNAME;
    let user = process.env.DBUSER;
    let host = process.env.DBHOST;

    const dumpFileName = `${Math.round(Date.now() / 1000)}.dump.sql`
    mysqldump({
        connection: {
            host: host,
            user: user,
            password: password,
            database: database,
        },
        dumpToFile: `${dumpFileName}`,
    });
    res.send("Database Back Up Created On Server!")
})

// // get member email, name
// Router.get("/memberDetails", validateToken, (req, res) => {
//     const memberId = req.query.memberId;
//     db.query("SELECT email FROM user WHERE id = ? AND role = 'M'", memberId, (err, result) => {
//         if (err) {
//             console.log(err)
//             res.status(400).send({ error: 'Bad request!' })
//         }
//         else {
//             res.send(result);
//         }
//     })
// })


// get all clients
Router.get("/clients", validateToken, adminRole, (req, res) => {
    const query = "SELECT id,name,email,leader_id FROM user WHERE role = 'C'"
    db.query(query, (err, result) => {
        if (err) res.status(400).send({ error: 'Bad request!' })
        else {
            res.send(result)
        }
    })
})

// assign clients to a leader
Router.put("/assignClients", validateToken, adminRole, (req, res) => {
    const leaderId = req.body.leaderId;
    const clients = req.body.clients;
    db.query("UPDATE user SET leader_id = ? WHERE role = 'C' AND id IN(?)", [leaderId, clients], (err, result) => {
        if (err) res.status(400).send({ error: 'Bad request!' })
        else {
            res.send("Clients added succesfully!")
        }
    })

})

// change client's leader
Router.put("/reassignClient", validateToken, adminRole, (req, res) => {
    const leaderId = req.body.leaderId;
    const clientId = req.body.clientId;
    db.query("UPDATE user SET leader_id = ? WHERE role = 'C' AND id = ?", [leaderId, clientId], (err, result) => {
        if (err) {

            res.status(400).send({ error: 'Bad request!' })
        }
        else {
            res.send("Client reassigned succesfully!")
        }
    })
})

module.exports = Router;