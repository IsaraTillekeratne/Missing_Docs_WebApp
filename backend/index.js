const express = require('express');
const app = express();
const db = require("./connection")
const bodyParser = require('body-parser');
const cors = require('cors');

const SignupRoute = require("./Routes/Signup");
const SigninRoute = require("./Routes/Signin");

app.use(express.json());

app.use(cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/Signup", SignupRoute);
app.use("/Signin", SigninRoute);

app.listen(3001, function () {
    console.log('server running');
});



