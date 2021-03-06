const express = require("express");
const router = express.Router();
const registerController = require("../controllers/registerController.js");
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

router.get("/status", (req, res) => {
  res.render("status");
});

router.get("/esnDir", (req, res) => {
  res.render("esnDir");
});

router.get("/announcement", (req, res) => {
  res.render("announcement");
})

router.get("/chatroom", (req, res) => {
  res.render("chatroom");
});

router.get("/privateChatroom", (req, res) => {
  res.render("privateChatroom");
});

router.get("/privateMsgs", (req, res) => {
  res.render("privateMsgs");
});

router.get("/status", (req, res) => {
  res.render("status");
})


module.exports = router;