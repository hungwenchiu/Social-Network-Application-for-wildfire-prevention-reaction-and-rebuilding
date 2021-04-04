const msgPrivateModel = require("../models/msgPrivateModel");
const mydb = require('../utils/database.js');

beforeAll(()=>{
  var privatemsg1 = mydb.getConnection().awaitQuery("INSERT INTO privatemsg (content, senderName, receiverName, isRead ) VALUES (\"Hi1\", \"dahan\", \"nahad\", \"unread\")");
  var privatemsg2 = mydb.getConnection().awaitQuery("INSERT INTO privatemsg (content, senderName, receiverName, isRead ) VALUES (\"Hi2\", \"dahan\", \"nahad\", \"unread\")");

  var privatemsg3 = mydb.getConnection().awaitQuery("INSERT INTO privatemsg (content, senderName, receiverName, isRead ) VALUES (\"Hi3\", \"apple\", \"oreo\", \"unread\")");
  var privatemsg3 = mydb.getConnection().awaitQuery("INSERT INTO privatemsg (content, senderName, receiverName, isRead ) VALUES (\"Hi4\", \"peach\", \"oreo\", \"unread\")");
});

afterAll(()=>{
  var privatemsg = mydb.getConnection().awaitQuery("TRUNCATE privatemsg");
});



test('Find all messages sent from sender username to receiver username', () => {
  return msgPrivateModel.findMsgsBetween("dahan","nahad").then(() => {
      var data = mydb.getConnection().awaitQuery("SELECT content FROM privatemsg WHERE senderName = \"dahan\" AND receiverName = \"nahad\"").then((msg)=> {
          var result1 = Object.values(JSON.parse(JSON.stringify(msg)));
          var compareArray = [{"content": "Hi1"},{"content": "Hi2"}];
          
          expect(result1).toEqual(compareArray);
      });
  })
});


test('Find all senders with unread message count to a receiver', () => {
    return msgPrivateModel.findSendersWithUnreadMsgsByReceiver("oreo").then(() => {
        var data = mydb.getConnection().awaitQuery("SELECT senderName FROM privatemsg WHERE receiverName=\"oreo\" AND isRead = \"unread\"").then((status)=> {
            var result2 = Object.values(JSON.parse(JSON.stringify(status)));      
            var compareArray = [{"senderName": "apple"},{"senderName": "peach"}];
            expect(result2).toEqual(compareArray);
        });
    })
  });

test('Changes all unread messages between sender and receiver to read', () => {
    return msgPrivateModel.updateToReadBetween("dahan", "nahad").then(() => {
        var req = mydb.getConnection().awaitQuery("SELECT content FROM privatemsg WHERE senderName = \"dahan\" AND receiverName = \"nahad\" AND isRead = \"read\"").then((res) => {
            expect(res.length).toEqual(2);
        })
    })
  });

