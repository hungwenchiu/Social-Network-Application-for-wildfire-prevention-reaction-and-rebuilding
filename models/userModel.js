const mydb = require('../utils/database.js');
const bcrypt = require("bcryptjs");

class User {
    static create(username, password) {
        return new Promise((resolve, reject) => {
            const saltRounds = 10;
            bcrypt.hash(password, saltRounds)
                .then((hashedPassword) => {
                    const sql_create_user = "INSERT INTO user (username, password, isonline) VALUES ?";
                    const values = [
                        [username, hashedPassword, 1]
                    ];
                    // mysql-await
                    const dbResp = mydb.getConnection().awaitQuery(sql_create_user, [values]);
                    return dbResp; // return a Promise, so it will wait 
                })
                .then((dbResp) => {
                    console.log("row inserted: " + dbResp.affectedRows);
                    resolve(dbResp);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }

    static findUserByName(username) {
        return new Promise((resolve, reject) => {
            const sql_check_user = "SELECT * FROM user WHERE username = ?"
            mydb.getConnection().awaitQuery(sql_check_user, username)
                .then((dbResp) => {
                    resolve(dbResp);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }

    static findUserByNameWithoutPwd(username) {
        return new Promise((resolve, reject) => {
            const sql_check_user = "SELECT userid, username, isonline FROM user WHERE username = ?"
            mydb.getConnection().awaitQuery(sql_check_user, username)
                .then((dbResp) => {
                    resolve(dbResp);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }

    static setUserOnline(username) {
        return new Promise((resolve, reject) => {
            const sql_check_user = "UPDATE user SET isonline = true WHERE username = ?"
            mydb.getConnection().awaitQuery(sql_check_user, username)
                .then((dbResp) => {
                    resolve(dbResp);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }

    static getAllUsersWithoutPwd(){
        return new Promise((resolve, reject) => {
            const sql_check_user = "SELECT userid, username, isonline, status FROM user WHERE isonline IS NOT NULL ORDER BY isonline DESC, username"
            mydb.getConnection().awaitQuery(sql_check_user)
            .then((dbResp)=> {
                resolve(dbResp);
            })
            .catch((err)=>{
                reject(err);
            });
        });
    }



    static setUserOffline(username) {
        return new Promise((resolve, reject) => {
            const sql_check_user = "UPDATE user SET isonline = false WHERE username = ?"
            mydb.getConnection().awaitQuery(sql_check_user, username)
                .then((dbResp) => {
                    resolve(dbResp);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }




}

module.exports = User;
