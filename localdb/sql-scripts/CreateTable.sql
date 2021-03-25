SET @@auto_increment_increment=1;
CREATE TABLE user (
    userid int AUTO_INCREMENT NOT NULL PRIMARY KEY,
    username varchar(255) UNIQUE,
    password varchar(1000),
    isonline varchar(20) DEFAULT "0",
    status varchar(255) DEFAULT NULL
);

CREATE TABLE msg (
    msgid int AUTO_INCREMENT NOT NULL PRIMARY KEY,
    content varchar(255),
    sendername varchar(255) NOT NULL,
    senderstatus varchar(255),
    senderisonline varchar(255),
    receivername varchar(255),
    ts TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE privateMsg (
    msgid int AUTO_INCREMENT NOT NULL PRIMARY KEY,
    content varchar(255),
    senderName varchar(255) NOT NULL,
    senderStatus varchar(255),
    receiverName varchar(255) NOT NULL,
    receiverStatus varchar(255),
    isRead varchar(255) DEFAULT "unread",
    ts TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE status (
    idstatus int AUTO_INCREMENT NOT NULL PRIMARY KEY,
    username varchar(255),
    status varchar(255),
    ts TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);