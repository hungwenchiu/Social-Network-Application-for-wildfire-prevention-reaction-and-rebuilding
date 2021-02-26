// entry point of whole app

//Require modules
const express = require("express");
// const mysql = require("mysql");
const connection = require('./utils/database');
const path = require("path");
const http = require("http");
const socketio = require("socket.io");
const moment = require("moment");
const expressLayouts = require("express-ejs-layouts");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");
const main_router = require("./routers/index");
const app = express();
const server = http.createServer(app);
const io = socketio(server);



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

// const server = app.listen(3000, () => console.log('Example app listening on port 3000!'));



// TODO: test this in windows
// if (process.platform === "win32") {
//   console.log('win32 detected.');
//   var rl = require("readline").createInterface({
//     input: process.stdin,
//     output: process.stdout
//   });

//   rl.on("SIGINT", function () {
//     process.emit("SIGINT");
//   });
// }

// process.on('SIGTERM', () => {
//     console.log('SIGTERM signal received.');
//     gracefulShutdown();
// });

// process.on('SIGINT', function() {
//     console.log("SIGINT signal received.");
//     gracefulShutdown();
// });

// async function gracefulShutdown() {
//   console.log('http server closing');
//   await awaitServerClose();
//   console.log('http server closed 2');
//   console.log('db connection closing');
//   await connection.awaitEnd();
//   console.log('db connection closed\n');
// }

// function awaitServerClose() {
//   return new Promise((resolve, reject) => {
//     server.close(function(err) {
//       if (err) {
//         return reject(err);
//       }
//       console.log('http server closed 1');
//       resolve();
//     });
//   });
// }