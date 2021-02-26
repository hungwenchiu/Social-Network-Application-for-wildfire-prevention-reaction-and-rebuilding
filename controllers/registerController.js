const mydb = require("../utils/database.js");
const blacklistModel = require("../utils/blacklist.js");
const blacklist = blacklistModel.getBlacklist();
const bcrypt = require("bcryptjs");
const HttpResponse = require("./httpResponse.js");
const userModel = require("../models/userModel.js");

// (deprecated)
const retrieveUserHelper = function (username) {
  return new Promise((resolve, reject) => {
    const sql_check_user = "SELECT * FROM user WHERE username = ?";
    mydb.getConnection().query(sql_check_user, username, (err, result) => {
      if (!err) {
        resolve(result);
      } else {
        resolve({
          status: "error",
          message: "Error Getting Data",
          debug: err,
        });
      }
    });
  });
};

// (deprecated)
async function retrieveUser(username, password) {
  //   var resMsg;

  // if user is in the blacklist
  if (blacklist.includes(username.toLowerCase())) {
    return new HttpResponse(
      "Username is in blacklist. Please try again.",
      "invalidUsername",
      "true"
    );
  }

  try {
    console.log("hey000");
    var result = await retrieveUserHelper(username);
  } catch (error) {
    console.log(error);
  }
  if (result.length > 0) {
    console.log("hey001");
    // username exists, further check if password is correct (login) or incorrect (must reenter => display error to user)
    //   const username_in_db = result[0].username;
    //   const password_in_db = result[0].password;

    const isMatch = await bcrypt.compare(password, result[0].password);
    if (isMatch) {
      //successful login http response
      console.log("hey003"); // go here
      return new HttpResponse(
        "User is logged in successfully.",
        "loginSuccessful",
        "false"
      );
    } else {
      console.log("hey004");
      //incorrect password http response
      return new HttpResponse(
        "Username and/or password is incorrect. Please try again.",
        "passwordIncorrect",
        "true"
      );
    }
    // bcrypt.compare(password, result[0].password, (err, isMatch) => {
    //   console.log("hey002");
    //   if (err) throw (err);
    // });
  } else {
    // if username doesn't exist, ask for comfirmation
    console.log("hey005");
    return new HttpResponse("User doesn't exist.", "userNotExist", "true");
  }
}

async function findUserByNameWithoutPwd(username) {
  var resMsg = checkUsernameFormat(username);
  if (resMsg !== "") {
    return new HttpResponse(resMsg, "invalidUsername", "true");
  }
  resMsg = await userModel
    .findUserByNameWithoutPwd(username)
    .then((dbResult) => {
      return new HttpResponse(
        "User Search OK.",
        "userSearchOk",
        "false",
        dbResult
      );
    })
    .catch((err) => {
      return new HttpResponse(
        "User Search Failed.",
        "userSearchFailed",
        "true",
        err
      );
    });
  return resMsg;
}

async function createUser(username, password) {
  var resMsg = "";
  if (resMsg !== "") {
    return new HttpResponse(resMsg, "invalidPassword", "true");
  }
  resMsg = await userModel
    .create(username, password)
    .then((dbResult) => {
      return new HttpResponse("User is created.", "userCreated", "false");
    })
    .catch((err) => {
      return new HttpResponse("db error.", "dbError", "true", err);
    });
  return resMsg;
}

// TODO: move to model
async function login(username, password) {
  var resMsg = "";
  if (resMsg !== "") {
    return new HttpResponse(resMsg, "invalidPassword", "true");
  }
  resMsg = await userModel
    .findUserByName(username)
    .then((userList) => {
      if (userList.length == 0) {
        throw new Error("user not found");
      }
      const isMatch = bcrypt.compare(password, userList[0].password);
      return isMatch; // return a Promis; we'll wait for it to finish before continuing
    })
    .then((isMatch) => {
      if (isMatch) {
        // successful login http response
        // TODO: add JWT token logic here
        return new HttpResponse(
          "User is logged in successfully.",
          "loginSuccessful",
          "false"
        );
      } else {
        // incorrect password http response
        return new HttpResponse(
          "Username and/or password is incorrect. Please try again.",
          "passwordIncorrect",
          "true"
        );
      }
    })
    .catch((err) => {
      return new HttpResponse("db error.", "dbError", "true", err.message);
    });

  return resMsg;
}

function checkUsernameFormat(username) {
  var resMsg = "";
  var reg = /^[A-Za-z0-9]+(?:[_-][A-Za-z0-9]+)*$/;
  if (username.length < 3 || !reg.test(username)) {
    resMsg =
      "username should have at least 3 characters, can contain any letters from a to z and any numbers from 0 through 9, please try again";
  } else {
    if (blacklist.includes(username.toLowerCase())) {
      resMsg = "username is in blacklist. Please try again.";
    }
  }
  return resMsg;
}

// checkPasswordFormat = (password) => {
//   var resMsg = "";
//   if (password.length < 4) {
//     resMsg = "password should have at least 4 characters";
//   }
//   return resMsg;
// };

module.exports = {
  register: retrieveUser, // (deprecated)
  createUser: createUser,
  findUserByNameWithoutPwd: findUserByNameWithoutPwd,
  login: login,
};
