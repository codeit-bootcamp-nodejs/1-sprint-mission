"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createToken = createToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const constants_1 = require("../lib/constants");
// access , refresh
function createToken(user, type) {
    const payload = { userId: user.id };
    const options = {
        expiresIn: type === "refresh" ? "2w" : "1h",
    };
    return jsonwebtoken_1.default.sign(payload, constants_1.JWT_SECRET, options);
}
