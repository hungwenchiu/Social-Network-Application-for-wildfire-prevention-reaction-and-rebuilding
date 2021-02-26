const express = require("express");
const router = express.Router();
const registerController = require('../controllers/registerController.js');
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

router.get("/joincommunity", (req, res) => {
  res.render("registration");
});

router.get("/confirmation", (req, res) => {
  res.render("confirmation");
});

router.get("/welcome", (req, res) => {
  res.render("welcome");
});

//Handle entered username and password (TODO: remove this API once ready)
router.post("/registration", async function(req, res) {

  const {username, password} = req.body;

  const resMsg = await registerController.register(username, password);

  console.log(resMsg);

  res.send(resMsg);
  // res.redirect("http://localhost:8080/welcome");
});

/** User RESTful API zone **/
router.get("/users", async function(req, res) {

  const {username} = req.query;
  const resMsg = await registerController.findUserByNameWithoutPwd(username);
  res.send(resMsg); 
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

/** User RESTful API zone **/


module.exports = router;
