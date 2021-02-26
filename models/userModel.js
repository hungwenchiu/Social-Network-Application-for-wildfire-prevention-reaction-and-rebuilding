const mydb = require('../utils/database.js');
const bcrypt = require("bcryptjs");

class User {
    static create(username, password) {
        return new Promise((resolve, reject) => {
            const saltRounds = 10;
            bcrypt.hash(password, saltRounds)
            .then((hashedPassword)=> {
                const sql_create_user = "INSERT INTO user (username, password) VALUES ?";
                const values = [
                [username, hashedPassword]
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

    static findUserByName(username){
        return new Promise((resolve, reject) => {
            const sql_check_user = "SELECT * FROM user WHERE username = ?"
            mydb.getConnection().awaitQuery(sql_check_user, username)
            .then((dbResp)=> {
                resolve(dbResp);
            })
            .catch((err)=>{
                reject(err);
            });
        });
    }
    
    static findUserByNameWithoutPwd(username){
        return new Promise((resolve, reject) => {
            const sql_check_user = "SELECT userid, username FROM user WHERE username = ?"
            mydb.getConnection().awaitQuery(sql_check_user, username)
            .then((dbResp)=> {
                resolve(dbResp);
            })
            .catch((err)=>{
                reject(err);
            });
        });
    }



}

module.exports = User;