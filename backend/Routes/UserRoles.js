const express = require('express');
const Router = express.Router();
const { validateToken } = require('../jwt');

Router.get("/getRole", validateToken, (req, res) => {
    if (req.userRole === null) {
        res.status(401).send({ error: "You are not assigned to a role. Please try later." });
    } else {
        res.send({ role: req.userRole });
    }

})

module.exports = Router;