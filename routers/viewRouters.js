const express = require("express");
const router = express.Router();
const registerController = require("../controllers/registerController.js");
const HttpResponse = require("../controllers/httpResponse.js");
const cookieParser = require("cookie-parser");

router.use(cookieParser());

router.get("/", (req, res) => {
  res.render("homepage");
});

router.get("/joincommunity", (req, res) => {
  res.render("registration");
});

router.get("/welcome", (req, res) => {
  res.render("welcome");
});

router.use(registerController.verifyJwtToken); // jwt validation middle ware

router.get("/chatroom", (req, res) => {
  res.render("chatroom");
});

module.exports = router;