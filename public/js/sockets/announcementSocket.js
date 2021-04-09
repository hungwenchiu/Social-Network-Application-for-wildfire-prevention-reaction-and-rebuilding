import Announcement from '../modules/announcementModule.js';
import Notification from '../modules/notificationModule.js';

var socket = io();

const Notif = new Notification();
Notif.bindSessionWithNotificationTopic(socket)
Notif.notifyAnnouncement(socket);

socket.emit('bindUserNameWithSocket', sessionStorage.getItem("username")); // ***add username