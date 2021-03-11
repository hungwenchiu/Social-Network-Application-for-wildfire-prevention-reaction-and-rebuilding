// entry point of whole app

//Require modules
const express = require("express");
// const mysql = require("mysql");
const connection = require('./utils/database');
const path = require("path");
const http = require("http");
const moment = require("moment");
const expressLayouts = require("express-ejs-layouts");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");
const main_router = require("./routers/index");
const app = express();
const server = http.createServer(app);
const SocketioService = require("./utils/socketio");

//Set up EJS
//app.use(expressLayouts);
app.set("views", path.join(__dirname, "./views"));
app.engine(".html", require("ejs").__express);
app.set("view engine", "ejs");

//Establish static folder
const publicDirectoryPath = path.join(__dirname, "public");
app.use(express.static(publicDirectoryPath));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//Establish router
//app.use("/", main_router); /*replace index with name of router,js*/
app.use("/", require("./routers/index.js"));

//Start up server
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => console.log(`Server started on port ${PORT}`));

// Socketio set up 
const socketioServiceInstance = new SocketioService(server);
