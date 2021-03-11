const express = require("express");
const router = express.Router();
const registerController = require('../controllers/registerController.js');
const chatController = require('../controllers/chatController.js');
const HttpResponse = require('../controllers/httpResponse.js');

//const path = require("path");

//home page
// router.get("/" , (req, res) => res.sendFile(path.join(__dirname, "../views", "homepage.html")));
// // res.sendFile('/chat/view_client.html', { root: './' });
// //join community page

// router.get("/login" , (req, res) => res.sendFile(path.join(__dirname, "../views", "login.html")));
// // http://localhost:8080/login.html

router.get("/", (req, res) => {
  res.render("homepage");
});

router.get("/socketiotest", (req, res) => {
  res.render("socketiotest");
});

router.get("/joincommunity", (req, res) => {
  res.render("registration");
});

router.get("/confirmation", (req, res) => {
  res.render("confirmation");
});

router.get("/welcome", (req, res) => {
  res.render("welcome");
});

router.get("/chatroom", (req, res) => {
  res.render("chatroom");
});

router.post("/users", async function(req, res) {

  const {username, password} = req.body;
  const resMsg = await registerController.createUser(username, password);
  res.send(resMsg);
});

router.post("/users/login", async function(req, res) {

  const {username, password} = req.body;
  const resMsg = await registerController.login(username, password);
  res.send(resMsg);

});

//TODO: DO WE ADD JWT AUTH HERE FOR RETRIEVE USERS
router.get("/users", async function(req, res) {

  const {username} = req.query;
  var resMsg;
  if (username) {
    resMsg = await registerController.findUserByNameWithoutPwd(username);
  }else {
    
    resMsg = await registerController.getAllUsersWithoutPwd();
  }
  res.send(resMsg); 
});

router.get("/users/:username", async function(req, res) {

  const {username} = req.params;
  var resMsg = await registerController.findUserByNameWithoutPwd(username);
  res.send(resMsg); 
});

router.use(registerController.verifyJwtToken) // jwt validation middle ware 

/** User RESTful API zone **/
// /users/:username/offline
router.put("/users/:username/offline", async function(req, res) {
  
  const {username} = req.params;
  //const token = req.headers.authorization.slice(7);
  const token = req.headers.authorization

  var resMsg = await registerController.logout(username, token);
  res.send(resMsg);

});
/** User RESTful API zone **/

/** Chat RESTful API zone */

// /messages/public
router.get("/messages/public", async function(req, res) {
  const resMsg = await chatController.getPublicMsgs();
  res.send(resMsg);
});

router.post("/messages/public", async function(req, res) {
  const {username, content, status, isOnline} = req.body; // ??? isOnline and status shouldn't be decided by front-end request ??? timestamp should also be provided by servers 
  const resMsg = await chatController.sendMsg(content, username, status, isOnline);
  res.send(resMsg);
});
/** Chat RESTful API zone */

module.exports = router;
