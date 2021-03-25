const mydb = require('../utils/database.js');

class Msg {

    constructor(content, sendername, senderstatus, senderisonline, receivername) {
        this.content = content;
        this.sendername = sendername;
        this.senderstatus = senderstatus;
        this.senderisonline = senderisonline;
        this.receivername = receivername;
    }

    static create(content, sendername, senderstatus, senderisonline, receivername) {
        var senderisonline = (senderisonline == 1)?"true":"false";
        return new Promise((resolve, reject) => {
            const sql_create_msg = "INSERT INTO msg (content, sendername, senderstatus, senderisonline, receivername) VALUES ?";
            const values = [
            [content, sendername, senderstatus, senderisonline, receivername]
            ];
            mydb.getConnection().awaitQuery(sql_create_msg, [values])
            .then((result) => {
                resolve(result);
            }) 
            .catch((err) => {
                reject(err);
            });;
        });
    }

    static findMsg(msgid) {
        return new Promise((resolve, reject) => {
            const sql_query_msg = "SELECT * FROM msg WHERE msgid = ?";
            const values = [
                [msgid]
            ];
            mydb.getConnection().awaitQuery(sql_query_msg, [values])
            .then((result) => {
                resolve(result);
            }) 
            .catch((err) => {
                reject(err);
            });;
        });        
    }

    static findPublicMsgs() {
        return new Promise((resolve, reject) => {
            const sql_query_public_msg = "SELECT * FROM msg WHERE receivername IS NULL ORDER BY ts ASC";
            mydb.getConnection().awaitQuery(sql_query_public_msg)
            .then((result) => {
                resolve(result);
            }) 
            .catch((err) => {
                reject(err);
            });;
        });
    }

    // static findUserByName(username){
    //     return new Promise((resolve, reject) => {
    //         const sql_check_user = "SELECT * FROM user WHERE username = ?"
    //         mydb.getConnection().awaitQuery(sql_check_user, username)
    //         .then((dbResp)=> {
    //             resolve(dbResp);
    //         })
    //         .catch((err)=>{
    //             reject(err);
    //         });
    //     });
    // }
    
    // static findUserByNameWithoutPwd(username){
    //     return new Promise((resolve, reject) => {
    //         const sql_check_user = "SELECT userid, username FROM user WHERE username = ?"
    //         mydb.getConnection().awaitQuery(sql_check_user, username)
    //         .then((dbResp)=> {
    //             resolve(dbResp);
    //         })
    //         .catch((err)=>{
    //             reject(err);
    //         });
    //     });
    // }

}

module.exports = Msg;