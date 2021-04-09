// append new msg/msg record to content-list
import Msg from '../modules/msgModule.js';
import Announcement from '../modules/announcementModule.js';
export default class Notification {

  constructor() {}

  static getUserCardPage(senderName) {
    // TODO: BUG, should be privateMsgs.js line 25
    return `<div class="list-group-item">
        <div class="d-flex align-items-start">
            <div class="flex-grow-1 ml-3"> ${senderName}</div>
            <span style="font-size: 10px; color: red; padding-top: 5px;">
                <em class="fas fa-circle"></em>
            </span>                      
        </div>
      </div>`;
  }

  static getRedDotPage() {
    return `
      <span style="font-size: 10px; color: red; padding-top: 5px;">
      <em class="fas fa-circle"></em>
      </span> 
      `;
  }

  static showUnreadNotificationOnInboxButton(talkingToUsername, senderName, receiverName) {
    if (talkingToUsername !== senderName) {
      console.log("talkingToUsername: " + talkingToUsername);
      console.log("senderName: " + senderName);
      console.log("not in the private chat room");
      const inboxBtn = $("#inbox-btn");
      inboxBtn.attr("style", "color:red");
    } else {
      console.log("in the private chat room, update unread...");
      console.log("talkingToUsername: " + talkingToUsername);
      console.log("receiverName: " + receiverName);
      new Msg().updateUnreadToRead(talkingToUsername, receiverName);
    }
  }

  bindSessionWithNotificationTopic(socket) {
    socket.on("notification", (res) => {
      console.log("notification res: ", res);
      const senderName = res[0].senderName;
      const receiverName = res[0].receiverName;
      const privateMsgUserJson = JSON.parse(sessionStorage.getItem("privateMsgUserJson"));

      if (privateMsgUserJson !== null && privateMsgUserJson !== undefined) {
        console.log("privateMrnsgUserJson: ", privateMsgUserJson);
        console.log("senderName: ", senderName);
        console.log("senderName is exist: ", privateMsgUserJson[senderName]);
        if (privateMsgUserJson[senderName] !== undefined) {
          const notificationId = "#" + senderName + "-chat";
          const notification = $(notificationId);
          const reddot = Notification.getRedDotPage();
          notification.empty();
          notification.append(reddot);
        } else {
          const privateChatUserList = $("#private-chat-user-list");
          const userCard = Notification.getUserCardPage(senderName);
          privateChatUserList.append(userCard);
          privateMsgUserJson[senderName] = "exist";
          sessionStorage.setItem("privateMsgUserJson", JSON.stringify(privateMsgUserJson));
        }
      }

      const talkingToUsername = sessionStorage.getItem("talkingToUsername");
      // show unread notification on inbox button
      Notification.showUnreadNotificationOnInboxButton(talkingToUsername, senderName, receiverName);

    })
  }

  notifyAnnouncement(socket){
      socket.on("announcement", (res) => {
        console.log("announcement: socket");
        if($('title').text() === "Announcement")  
        {
          var data = res[0];
          new Announcement().printAnnouncement(data.sendername, data.content, data.ts);
        }
        else
        {
          console.log("announcement turn red");
          $('#announcement-btn').attr('style', 'color:red');
          sessionStorage.setItem('readAnnouncement', 'unread');
        }
    });
  }
  
}


