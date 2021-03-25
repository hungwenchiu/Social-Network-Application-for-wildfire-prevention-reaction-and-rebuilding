const SocketioService = require("../utils/socketio");
const MsgModel = require("../models/msgModel");
const HttpResponse = require("./httpResponse.js");
const Msg = require("../models/msgModel");
const MsgPrivate = require("../models/msgPrivateModel");

async function sendPrivateMsg(
  content,
  sendingUsername,
  senderStatus,
  receivingUsername,
  receiverStatus
) {
  // step01: store msg in db
  const resMsg = await MsgPrivate.create(
    content,
    sendingUsername,
    senderStatus,
    receivingUsername,
    receiverStatus
  )
    .then((dbResult) => {
      console.log("PrivateMsg table updated row: " + dbResult.affectedRows);
      return new HttpResponse(
        "PrivateMsg is created.",
        "privateMsgCreated",
        "false",
        { insertId: dbResult.insertId }
      );
    })
    .catch((err) => {
      return new HttpResponse("db error.", "dbError", "true", err);
    });

  const insertId = resMsg.data.insertId;
  if (insertId == undefined) {
    return resMsg;
  }

  // step02: get the newly-created Msg from db (for its timestamp value)
  const msgForPush = await MsgPrivate.findMsgById(insertId);

  // step03: push msg to two users
  await SocketioService.getInstance().pushMsgToUser(msgForPush, "notification", receivingUsername);
  await SocketioService.getInstance().pushMsgToUser(msgForPush, "private message", sendingUsername);
  await SocketioService.getInstance().pushMsgToUser(msgForPush, "private message", receivingUsername);

  return resMsg;
}

async function findSendersWithUnreadMsgsByReceiver(username) {
    const res = await MsgPrivate.findSendersWithUnreadMsgsByReceiver(username)
      .then((dbResult) => {
        return new HttpResponse(
          "found senders with unread msgs",
          "foundSenders",
          "false",
          dbResult
        );
      })
      .catch((err) => {
        return new HttpResponse("db error.", "dbError", "true", err);
      });
    return res;
}

async function findMsgsBetween(sendingUsername, receivingUsername) {
    const res = await MsgPrivate.findMsgsBetween(sendingUsername, receivingUsername)
    .then((dbResult) => {
        return new HttpResponse("found private msgs between sender and receiver.", "PrivateMsgsFound", "false", dbResult);
    })
    .catch((err) => {
        return new HttpResponse("db error.", "dbError", "true", err);
    });
    return res;
}

async function updateToReadBetween(sendingUsername, receivingUsername) {
    const res = await MsgPrivate.updateToReadBetween(sendingUsername, receivingUsername)
    .then((dbResult) => {
        return new HttpResponse("updated unread private msgs to read.", "updateUnreadToRead", "false");
    })
    .catch((err) => {
        return new HttpResponse("db error.", "dbError", "true", err);
    });
    return res;
}

module.exports = {
  sendPrivateMsg: sendPrivateMsg,
  findSendersWithUnreadMsgsByReceiver: findSendersWithUnreadMsgsByReceiver,
  findMsgsBetween: findMsgsBetween,
  updateToReadBetween: updateToReadBetween,
};