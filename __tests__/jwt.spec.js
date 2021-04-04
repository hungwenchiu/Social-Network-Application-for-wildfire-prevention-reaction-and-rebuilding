const { default: axios } = require("axios");
const JWTService = require("../utils/auth.js");


var JWTServiceInstance;
beforeAll(() => {
    JWTServiceInstance = new JWTService();
});

describe("JWT Service", () => {
    test("first_unit_testing", async () => {

    });
});

