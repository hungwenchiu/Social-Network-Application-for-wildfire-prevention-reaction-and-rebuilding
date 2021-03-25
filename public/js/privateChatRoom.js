const username = sessionStorage.getItem('username');
const userStatus = sessionStorage.getItem('userStatus');
const talkingToUsername = sessionStorage.getItem('talkingToUsername');

$(document).ready(() => {
    sessionStorage.removeItem("privateMsgUserJson");
    // when loading, get all message records
    $.ajax({
        url: `/api/messages/private/${talkingToUsername}/${username}`,
        type: "GET",
        success: function (res) {
            const {data} = res;
            $.each(data, (index, privateMsg)=>{
                printMsg(privateMsg.senderName, privateMsg.content, privateMsg.ts, privateMsg.senderStatus);
                // console.log(e);
            });
            updateUnreadToRead(talkingToUsername, username);

        },
    });    

});

const updateUnreadToRead = (talkingToUsername, username) =>{
    console.log("updateUnreadToRead called");
    $.ajax({
        url: `/api/messages/private/${talkingToUsername}/${username}`,
        type: "PUT",
        success: function (res) {
            checkUnreadmsgForInboxBtn(username);
        },
    });
}

// append new msg/msg record to content-list
const printMsg = (senderName, content, time, userStatus) =>{

    var postTime = new Date(time);
    var msg;
    // console.log(username);

    if(!userStatus)
        userStatus = 'NOT SET';

    if(senderName === username) // own message ====> TO-DO Ted == username
    {
        msg = '<div class="chat">' + 
                '<div class="chat-icon">' + 
                    '<a class="avatar" data-placement="right">' + 
                        '<img src="icon.jpg" alt="Avatar" class="avatar">' + 
                    '</a>' + 
                '</div>' + 
                '<div class="chat-body">' + 
                    '<div class="chat-content">' + 
                        '<div class="chat-user">' + senderName + "  " + "[" + userStatus + "]" + '</div>' + 
                        '<div class="user-msg">' + 
                            '<span>' + content + '</span>' + 
                        '</div>' + 
                        '<time class="chat-time" datetime="2015-07-01T11:37">' + postTime + '</time>' + 
                    '</div>' +
                '</div>' + 
            '</div>';
    }
    else // message is from others
    {
        msg = '<div class="chat-left">' + 
                '<div class="chat-icon">' +
                    '<a class="avatar" data-placement="left">' +
                        '<img src="icon.jpg" alt="Avatar" class="avatar">' + 
                    '</a>' +
                '</div>' + 
                '<div class="chat-body">' + 
                    '<div class="chat-content">' +
                        '<div class="chat-user">' + senderName + "  " + "[" + userStatus + "]" + '</div>' + 
                        '<div class="user-msg">' + 
                            '<span>' + content + '</span>' + 
                        '</div>' + 
                        '<time class="chat-time" datetime="2015-07-01T11:39">' + postTime + '</time>' + 
                    '</div>' +
                '</div>' +
            '</div>';
    }
    
    $(".chat-window").append(msg);
    $(".chat-window").scrollTop($(".chat-window")[0].scrollHeight); // always keep the mesage content to the bottom
};

// add new message
$("#btn-send").on("submit", (e) => {
    e.preventDefault();

    if($("#msg-txt").val() === "")
        return;
    //--------send new message to server------ TO DO---
    const sendData = {
        sendingUsername: username,
        senderStatus: sessionStorage.getItem("userstatus"), // "HELP", "OK"
        receivingUsername: talkingToUsername,
        // receiverStatus: "ok", // TODO: not in use case, but nice to have 
        content: $("#msg-txt").val()
    };

    console.log("sendData: " , sendData);
        
    $.ajax({
        url: "/api/messages/private/",
        type: "POST",
        data: sendData, // const {username, content, status, isOnline} = req.body;
        dataType: "json",
        success: function (
            res // get return message from server
        ) {
            console.log(res);
        },
    });
    //--------send new message to server------ TO DO---
    $("#msg-txt").val("");
});

// logout button
$(".logout-btn").on("click", (e)=>{

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
});




