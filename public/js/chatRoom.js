const username = sessionStorage.getItem('username');

// append new msg/msg record to content-list
const printMsg = (sendername, content, time) =>{

    
    var postTime = new Date(time);
    var msg;
    // console.log(username);
    if(sendername === username) // own message ====> TO-DO Ted == username
    {
        msg = '<div class="chat">' + 
                '<div class="chat-icon">' + 
                    '<a class="avatar" data-placement="right">' + 
                        '<img src="icon.jpg" alt="Avatar" class="avatar">' + 
                    '</a>' + 
                '</div>' + 
                '<div class="chat-body">' + 
                    '<div class="chat-content">' + 
                        '<div class="chat-user">' + sendername + "  [OK]" + '</div>' + 
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
                        '<div class="chat-user">' + sendername + "  [OK]" + '</div>' + 
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

$(document).ready(() => {
    
    // when loading, get all message records
    $.ajax({
        url: "/api/messages/public",
        type: "GET",
        success: function (res) {
            
            const {data} = res;
            $.each(data, (index, e)=>{
                printMsg(e.sendername, e.content, e.ts);
            });

        },
    });

});

// add new message
$("#btn-send").on("submit", (e) => {
    e.preventDefault();

    if($("#msg-txt").val() === "")
        return;
    //--------send new message to server------ TO DO---
    const sendData = {
        username: username,
        content: $("#msg-txt").val(),
        status: "emergency",
        isOnline: true
    };
        
    $.ajax({
        url: "/api/messages/public",
        type: "POST",
        data: sendData, // const {username, content, status, isOnline} = req.body;
        dataType: "json",
        success: function (
            res // get return message from server
        ) {
            // console.log(res);
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



const socket = io();
// receive real time message from server and print it
socket.on("public message", (res) => {
    res = res[0];
    printMsg(res.sendername, res.content, res.ts);
});
socket.emit('bindUserNameWithSocket', username); // ***add username