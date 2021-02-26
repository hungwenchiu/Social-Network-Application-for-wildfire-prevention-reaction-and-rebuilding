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

    $.ajax({
      url: `/users?username=${sendData.username}`,
      type: "GET",
      data: sendData.username,
      dataType: "json",
      success: function (res) {
        if (res.isError === "false") {
          if (res.data.length === 0) {
            // empty data --> username doesn't exist, ask for creating new user
            $("#register-msg").modal("show");
          } else {
            // login
            $.ajax({
              url: `/users/login`,
              type: "POST",
              data: sendData,
              dataType: "json",
              success: function (
                res // get return message from server
              ) {
                if (res.resCode === "loginSuccessful") {
                  // TODO: redirect to Directory
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

    $.ajax({
      url: "/users",
      type: "POST",
      data: sendData,
      dataType: "json",
      success: function (
        res // get return message from server
      ) {
        if (res.resCode === "userCreated") $("#register-msg").modal("hide");
        location.href = "welcome";
      },
    });
  });
});
