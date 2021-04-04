const express = require("express");
const router = express.Router();
const registerController = require("../controllers/registerController.js");
const cookieParser = require("cookie-parser");
router.use(cookieParser());
router.post("/users", async function (req, res) {
  const resMsg = await registerController.createUser(req.body.username, req.body.password);
  res.cookie("token", resMsg.data.token, { maxAge: 900000, httpOnly: true });
  res.send(resMsg);
});
router.put("/users/:username/online", async function (req, res) {
  const resMsg = await registerController.login(req.params.username, req.body.password);
  if (resMsg.data !== undefined) 
    res.cookie("token", resMsg.data.token, { maxAge: 900000, httpOnly: true });
  res.send(resMsg);
});
router.get("/users", async function (req, res) {
  var resMsg;
  if (req.query.username)
    resMsg = await registerController.findUserByNameWithoutPwd(req.query.username);
  else
    resMsg = await registerController.getAllUsersWithoutPwd();
  res.send(resMsg);
});
router.get("/users/:username", async function (req, res) {
  var resMsg = await registerController.findUserByNameWithoutPwd(req.params.username);
  res.send(resMsg);
});
module.exports = router;