$(document).ready(() => {
  var btnLogin = $(".btnSubmit");
  var warningMsg = $("#warning-msg");

  // submit the username and password
  $("#lgform").on("submit", (e) => {
    e.preventDefault();
    const sendData = {
      username: $("#username").val(),
      password: $("#password").val(),
    };
    console.log(sendData.username);
    $.ajax({
      url: `/api/users/${sendData.username}`,
      type: "GET",
      dataType: "json",
      success: function (res) {
        if (res.isError === "false") {
          if (res.data.length === 0) {
            // empty data --> username doesn't exist, ask for creating new user
            $("#register-msg").modal("show");
          } else {
            // login
            $.ajax({
              url: `/api/users/${sendData.username}/online`,
              type: "PUT",
              data: sendData,
              dataType: "json",
              success: function (
                res // get return message from server
              ) {
                // Login successful, token assigned
                if (res.resCode === "loginSuccessful") {
                  sessionStorage.setItem("username", $("#username").val());
                  window.location.href = window.location.origin + "/chatroom";
                  return;
                } else {
                  warningMsg.toggleClass("fade-in");
                  warningMsg.html(res.resMsg);
                  setTimeout(() => {
                    warningMsg.toggleClass("fade-in");
                  }, 2000);
                }
              },
            });
          }
        } else {
          // get error when call get users api
          warningMsg.toggleClass("fade-in");
          warningMsg.html(res.resMsg);
          setTimeout(() => {
            warningMsg.toggleClass("fade-in");
          }, 2000);
        }
      },
    });
  });

  // Press Ok Button and create new user
  $("#btn-create-user").click((e) => {
    const sendData = {
      username: $("#username").val(),
      password: $("#password").val(),
    };

    // create new user
    $.ajax({
      url: "/api/users",
      type: "POST",
      data: sendData,
      dataType: "json",
      success: function (
        res // get return message from server
      ) {
          if (res.resCode === "userCreated") 
          {
            sessionStorage.setItem("username", $("#username").val());
            $("#register-msg").modal("hide");
            window.location.href = window.location.origin + "/welcome";
          }
      },
    });

  });
});
