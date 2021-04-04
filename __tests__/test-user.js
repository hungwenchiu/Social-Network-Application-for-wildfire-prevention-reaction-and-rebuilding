const User = require("../models/userModel");
const mydb = require('../utils/database.js');

beforeAll(()=>{
    var user = mydb.getConnection().awaitQuery("TRUNCATE user");
  });

afterAll(()=>{
    var user = mydb.getConnection().awaitQuery("TRUNCATE user");
   
  });
  
describe('User registration ', () => {
    test('Registers a User', async () => {
        const userName = 'fake_username';
        return await User.create(userName,'password').then((dbResp) => {
            expect(dbResp.affectedRows).toBe(1);
        });
    });
});

describe('Search user by name ', () => {
    test('Seach by username', async () => {
        const userName = 'fake_username';
        return await User.findUserByName(userName).then((dbResp) => {
            expect(dbResp[0].username).toBe(userName);
        });
    });
});




