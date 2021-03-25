const owner = sessionStorage.getItem('username');
const userList = $("#user-list");
$(document).ready(() => {
  sessionStorage.removeItem("talkingToUsername");
  sessionStorage.removeItem("privateMsgUserJson");
  getUserList();
});

const getUserList = function() {
    $.ajax({
    url: "/api/users",
    type: "GET",
    dataType: "json",
    success: function (res) {
      console.log(res);

      // if there is a userlist, clean it
      if(userList.find(".list-group-item"))
      {
        userList.empty();
      }

      //add each user to html
      $.each(res.data, (index, user) => {
        const username = user.username;      
        const onlineStatus = user.isonline == 1 ? "online" : "offline";
        const userstatus = user.status;   
        // console.log(user.status);
        //TODO: status is hardcode
        const img = updateStatusImage(userstatus);
        var onOffColor = (onlineStatus === "online") ? `<div class="small" style="color:green;font-weight:bold;">${onlineStatus}</div>` : `<div class="small" style="color:gray;font-weight:bold;">${onlineStatus}</div>`
        var ownerBkColor = (username === owner) ? 'style="background-color: #FFF6D9;"' : '';
        const userCard = 
          `<div class="list-group-item" ${ownerBkColor} id=${username}>
          <div class="d-flex align-items-start">
            <img src=${img} class="rounded-circle mr-1" width="40" height="40">
            <div class="flex-grow-1 ml-3">${username} ${onOffColor} </div>
            <img src='/assets/chat.png' mr-1" width="30" height="30" onclick="goToPrivateChatroom('${username}')">
          </div>
        </div>`;
        userList.append(userCard);
      });
    },
  });
}


const updateStatusImage = function (status) {
    if(!status){
      return "/assets/offline.png";
    }
    if (status === "1") { // OK
      return "/assets/ok.png";
    }
    if (status === "2") { // HELP
      return "/assets/help.png";
    }
    if (status === "3") { // EMERGENCY
      return "/assets/emergency.png";
    }
};



function goToPrivateChatroom(talkingToUsername) {
  sessionStorage.setItem("talkingToUsername", talkingToUsername);
  if (talkingToUsername !== owner) {
    window.location.href = window.location.origin + "/privateChatroom";
  }
}

function userLogout(username){ // send close msg to server

  $.ajax({
    url: `/api/users/${username}/offline`,
    type: "PUT",
    data: username, // const {username, content, status, isOnline} = req.body;
    dataType: "json",
  
    success: function (
        res // get return message from server
    ) {
        sessionStorage.removeItem("username");
        window.location.href = "/";
    },
  });

}

// function slide(direction) {
//   var left = parseInt($("#fieldset-container fieldset").eq(0).offset().left),
//     width = $(window).width(),
//     position = -left / width + (direction ? 1 : -1),
//     length = $("#fieldset-container fieldset").length,
//     position = position > length - 1 ? length - 1 : position;
//   slideTo(position);
// }

// function slideTo(n) {
//   $("#fieldset-container").css("transform", "translateX(-" + n * 100 + "vw)");
// }

$("#dir-btn").on("click", (e) => {
  $("#user-list").empty();
  getUserList();
});

$(".logout-btn").on("click", (e)=>{
  userLogout(owner);
});

// update the user status if user's status updates
socket.on("update status", (res) => {

  var status = res[0];
  var username = res[1];
  
  console.log(status, username);
  console.log(updateStatusImage(status));
  //  change icon here
  $(`#${username}`).find('img:first').attr('src', updateStatusImage(status));
  
});

// for user login and logout, broadcast the updated online offline list to all users
socket.on("update userlist", (res) => {
  getUserList();
});

socket.emit('bindUserNameWithSocket', owner); // ***add username