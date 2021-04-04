const inboxBtn = $("#inbox-btn");
$(document).ready(() => {
    const username = sessionStorage.getItem('username');
    checkUnreadmsgForInboxBtn(username);
});

const checkUnreadmsgForInboxBtn = function(username) {
  console.log("checkUnreadmsgForInboxBtn called");
    $.ajax({
    url: "/api/users/" + username + "/private",
    type: "GET",
    dataType: "json",
    success: function (res) {
      //add each user to html

      var is_any_unread = false;
      $.each(res.data, (index, user) => {   
        if (user.count > 0) {
            is_any_unread = true;
        }
      });

      // inbox notification
      if (is_any_unread) {
        inboxBtn.attr('style', 'color:red');
      } else {
         inboxBtn.attr("style", "color:white");
      }
    },
  });
}

// logout button
$(".logout-btn").on("click", (e)=>{
  const username = sessionStorage.getItem("username");
  $.ajax({
      url: `/api/users/${username}/offline`,
      type: "PUT",
      data: username, 
      dataType: "json",

      success: function (
          res // get return message from server
      ) {
          sessionStorage.removeItem("username");
          window.location.href = "/";
      },
  });
});

