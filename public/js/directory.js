const userList = $("#user-list");
$(document).ready(() => {
  getUserList();
  // $.ajax({
  //   url: "/users",
  //   type: "GET",
  //   dataType: "json",
  //   success: function (res) {
  //     console.log(res);
  //     //add each user to html
  //     $.each(res.data, (index, user) => {
  //       const username = user.username;      
  //       const onlineStatus = user.isonline == 1 ? "online" : "offline";     
  //       //TODO: status is hardcode
  //       const img = getStatusImage("ok", onlineStatus);
  //       const userCard =
  //         `<a href="#" class="list-group-item list-group-item-action border-0">` +
  //         `<div class="d-flex align-items-start">` +
  //         `<img src=${img} class="rounded-circle mr-1" width="40" height="40">` +
  //         `<div class="flex-grow-1 ml-3">` +
  //         `${username}` +
  //         `<div class="small"></span>${onlineStatus}</div>` +
  //         `</div>` +
  //         `</div>` +
  //         `</a>`;
  //       userList.append(userCard);
  //     });
  //   },
  // });
  // add new message
});

const getUserList = function() {
    $.ajax({
    url: "/users",
    type: "GET",
    dataType: "json",
    success: function (res) {
      console.log(res);
      //add each user to html
      $.each(res.data, (index, user) => {
        const username = user.username;      
        const onlineStatus = user.isonline == 1 ? "online" : "offline";     
        //TODO: status is hardcode
        const img = getStatusImage("ok", onlineStatus);
        const userCard =
          `<a href="#" class="list-group-item list-group-item-action border-0">` +
          `<div class="d-flex align-items-start">` +
          `<img src=${img} class="rounded-circle mr-1" width="40" height="40">` +
          `<div class="flex-grow-1 ml-3">` +
          `${username}` +
          `<div class="small"></span>${onlineStatus}</div>` +
          `</div>` +
          `</div>` +
          `</a>`;
        userList.append(userCard);
      });
    },
  });
}

// get the corresponding status icon img
const getStatusImage = function (status, onlineStatus) {
  if (onlineStatus === "offline") {
    console.log("in get img function" + " the status is" + onlineStatus);
    return "/assets/offline.png";
  } else {
    return "/assets/ok.png";
  }
  // if (status === "ok") {
  //   return "/assets/ok.png";
  // }
  // if (status === "help") {
  //   return "/assets/help.png";
  // }
  // if (status === "emergency") {
  //   return "/assets/emergency.png";
  //}
};

$("#public-chat-btn").click(function (e) {
  e.preventDefault();
  slide(true); // console.log(left, width, position);
});
$("#dir-btn").click(function (e) {
  e.preventDefault();
  slide(false);
});

function slide(direction) {
  var left = parseInt($("#fieldset-container fieldset").eq(0).offset().left),
    width = $(window).width(),
    position = -left / width + (direction ? 1 : -1),
    length = $("#fieldset-container fieldset").length,
    position = position > length - 1 ? length - 1 : position;
  slideTo(position);
}

function slideTo(n) {
  $("#fieldset-container").css("transform", "translateX(-" + n * 100 + "vw)");
}

$("#dir-btn").on("click", (e) => {
  $("#user-list").empty();
  getUserList();
});