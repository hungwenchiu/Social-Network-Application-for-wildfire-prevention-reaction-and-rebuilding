const statusModel = require("../models/statusModel");
const mydb = require('../utils/database.js');


beforeEach(()=>{
  var user = mydb.getConnection().awaitQuery("INSERT INTO user (username) VALUES (\"dahan\")");
});

afterEach(()=>{
  var user = mydb.getConnection().awaitQuery("TRUNCATE user");
  var status = mydb.getConnection().awaitQuery("TRUNCATE status");
});

test('Setting status should insert new username, status entry into status table', () => {
  return statusModel.setNewStatus("dahan", "3").then(() => {
      var data = mydb.getConnection().awaitQuery("SELECT status FROM status WHERE username = \"dahan\" ORDER BY idstatus DESC").then((status)=> {
          var result1 = Object.values(JSON.parse(JSON.stringify(status)));
          result1 = JSON.stringify(result1[0].status)
          
          expect(result1).toBe('\"3\"');
      });
  })
});

test('Setting status should update status in user table', () => {
  return statusModel.setNewStatus("dahan", "2").then(() => {
      var data = mydb.getConnection().awaitQuery("SELECT status FROM user WHERE username=\"dahan\"").then((status)=> {
          var result2 = Object.values(JSON.parse(JSON.stringify(status)));
          result2 = JSON.stringify(result2[0].status)
          
          expect(result2).toBe('\"2\"');
      });
  })
});





// test('Setting status should update the username entry in the user table with new status', () => {
//     return statusModel.setNewStatus('dahan', '1').then(() => {
//         const data = mydb.getConnection().awaitQuery('SELECT status FROM user WHERE username=\'dahan\'').then((status)=> {
//             expect(status).toEqual([{"status": "1"}]);
//         });
//     })
// });

// test('the data is peanut butter', () => {
//     return expect(fetchData()).resolves.toBe('peanut butter');
//   });
  


