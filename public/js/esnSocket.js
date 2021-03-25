this.socket = io();

// receive real time message from server and print it
socket.on("public message", (res) => {
    if($('title').text() === "PublicChat")
    {
      res = res[0];
      // console.log(res);
      printMsg(res.sendername, res.content, res.ts, res.senderstatus);
    }
});
// 
socket.on("notification", (res) => {
  console.log("notification res: ", res);

  const senderName = res[0].senderName;
  const receiverName = res[0].receiverName;
  const privateMsgUserJson = JSON.parse(
    sessionStorage.getItem("privateMsgUserJson")
  );
  if (privateMsgUserJson !== null && privateMsgUserJson !== undefined) {
    console.log("privateMsgUserJson: ", privateMsgUserJson);
    console.log("senderName: ", senderName);
    console.log("senderName is exist: ", privateMsgUserJson[senderName]);
      if (privateMsgUserJson[senderName] !== undefined) {
      const notificationId = "#" + senderName + "-chat";
      const notification = $(notificationId);
      const reddot = `
              <span style="font-size: 10px; color: red; padding-top: 5px;">
              <em class="fas fa-circle"></em>
              </span> 
              `;
      notification.append(reddot);
    } else {
      const privateChatUserList = $("#private-chat-user-list");
      const userCard = `<div class="list-group-item">
              <div class="d-flex align-items-start">
                  <div class="flex-grow-1 ml-3"> ${senderName}</div>
                  <span style="font-size: 10px; color: red; padding-top: 5px;">
                      <em class="fas fa-circle"></em>
                  </span>                      
              </div>
          </div>`;
      privateChatUserList.append(userCard);
    }
  }

  /* TODO problem to be solved*/
  const talkingToUsername = sessionStorage.getItem("talkingToUsername");
  // show unread notification on inbox button
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
    updateUnreadToRead(talkingToUsername, receiverName);
  }   
  /* TODO problem to be solved*/
})

socket.on("private message", (res) => {
    console.log("private msg res: ", res);
    res = res[0];
    const talkingToUsername = sessionStorage.getItem("talkingToUsername");
    if (talkingToUsername) {
      if (talkingToUsername === res.senderName || res.senderName === sessionStorage.getItem("username")) {
        printMsg(res.senderName, res.content, res.ts, res.senderStatus);
      }
    }
})

socket.emit('bindUserNameWithSocket', sessionStorage.getItem("username")); // ***add username
