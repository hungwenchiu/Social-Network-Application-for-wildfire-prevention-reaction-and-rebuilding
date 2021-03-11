const SocketioService = require("../utils/socketio");
const MsgModel = require("../models/msgModel");
const HttpResponse = require("./httpResponse.js");
const Msg = require("../models/msgModel");

async function sendMsg(content, username, status, isOnline, receivername) {

    // step01: store msg in db
    const resMsg = await MsgModel.create(content, username, status, isOnline, receivername)
    .then((dbResult) => {
        console.log("msg table updated row: " + dbResult.affectedRows);
        return new HttpResponse("Msg is created.", "msgCreated", "false", {"insertId": dbResult.insertId});
    })
    .catch((err) => {
       return new HttpResponse("db error.", "dbError", "true", err);
    });
    
    const insertId = resMsg.data.insertId;
    if (insertId == undefined) {
        return resMsg;
    }

    // step02: get the newly-created Msg from db (for its timestamp value)
    const msgForPush = await MsgModel.findMsg(insertId);
    
    // step03: push msg to online users 
    await SocketioService.getInstance().pushMsg(msgForPush);
  
    return resMsg;
}

async function getPublicMsgs() {
    console.log("getPublicMsgs")

    const resMsg = await MsgModel.findPublicMsgs()
    .then((dbResult) => {
        return new HttpResponse("PublicMsg is queried.", "publicMsgQueried", "false", dbResult);
    })
    .catch((err) => {
        return new HttpResponse("db error.", "dbError", "true", err);
    });
    return resMsg;

}

module.exports = {
    sendMsg: sendMsg,
    getPublicMsgs: getPublicMsgs    
};
