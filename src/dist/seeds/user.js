"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = require("../models/User");
async function createTestUser() {
    const username = "nigolas";
    const password = "superheslo";
    const email = "test@test.com";
    const user = new User_1.User({ email, username });
    //User.register(user, password);
    console.log("new user registered");
}
exports.default = createTestUser;
