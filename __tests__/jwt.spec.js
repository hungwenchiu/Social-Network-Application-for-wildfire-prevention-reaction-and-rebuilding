const { default: axios } = require("axios");
const JWTService = require("../utils/auth.js");


var JWTServiceInstance;
beforeAll(() => {
    JWTServiceInstance = new JWTService();
});

describe("JWT Service", () => {
    test("first_unit_testing", async () => {
        // const token = "wrong_token";

        let res = await axios.get('http://localhost:8080/api/users');
        let data = res.data;
        console.log(data);


        // expect(JWTServiceInstance.is_token_valid(token)).toEqual(false);
    });
});

