const JWTService = require("../utils/auth.js");


var JWTServiceInstance;
beforeAll(() => {
    JWTServiceInstance = new JWTService();
});

describe("JWT Service", () => {
    test("is_token_valid test", () => {
        const token = "wrong_token";
        expect(JWTServiceInstance.is_token_valid(token)).toEqual(false);
    });
});
