const express = require('express');
const Router = express.Router();
const { validateToken } = require('../jwt')

Router.get('/', validateToken, (req, res) => {
    res.send("Successful");
})

module.exports = Router;