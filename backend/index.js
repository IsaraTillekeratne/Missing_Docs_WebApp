const express = require('express');
const app = express();
const db = require("./connection")
const bodyParser = require('body-parser');
const cors = require('cors');
const fileUpload = require('express-fileupload');

const SignupRoute = require("./Routes/Signup");
const SigninRoute = require("./Routes/Signin");
const UserRolesRoute = require("./Routes/UserRoles");
const AdminRoute = require("./Routes/Admin");
const LeaderRoute = require("./Routes/Leader");
const MemberRoute = require("./Routes/Member");
const ClientRoute = require("./Routes/Client");

app.use(express.json());
app.use(fileUpload());

app.use(cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/Signup", SignupRoute);
app.use("/Signin", SigninRoute);
app.use("/UserRoles", UserRolesRoute);
app.use("/Admin", AdminRoute);
app.use("/Leader", LeaderRoute);
app.use("/Member", MemberRoute);
app.use("/Client", ClientRoute);

app.listen(3001, function () {
    console.log('server running');
});



