$("#form-confirm").submit((e) =>{
    e.preventDefault();
     // login
    $.ajax({
        url: "/api/users/login",
        type: "POST",
        data: sendData,
        dataType: "json",
        success: function (
          res // get return message from server
        ) {
          // Login successful, token assigned
          if (res.resCode === "loginSuccessful") {
            sessionStorage.setItem("username", $("#username").val());
            sessionStorage.setItem("token", res.data.token);
            window.location.href = "/chatroom";
            return;
          } else {
            // TO-DO: login fail
          }
        },
    });
});