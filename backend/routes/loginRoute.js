const express = require("express");

const loginRouter = express.Router();

loginRouter.get('/', (req, res) => {
    res.send("Login page")
});

loginRouter.post('/register_user', (req, res) => {
    // TODO: Register Users

})

loginRouter.post('/authenticate_user', (req, res) => {
    // TODO: Authenticate Users

})

module.exports = loginRouter
