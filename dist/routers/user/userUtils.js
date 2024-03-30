"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const { JWT_SECRET } = require("../../utils/config");
const zod_1 = __importDefault(require("zod"));
const generateToken = (user) => {
    const token = jsonwebtoken_1.default.sign({ userId: user.userId, username: user.username, firstname: user.firstname, lastname: user.lastname, accountId: user.accountId, accountBalance: user.accountBalance }, JWT_SECRET, { expiresIn: "24h" });
    return token;
};
const hashPassword = (password) => __awaiter(void 0, void 0, void 0, function* () {
    const saltRounds = 10;
    const hashedPassword = yield bcrypt_1.default.hash(password, saltRounds);
    return hashedPassword;
});
const validateUpdateUserPayload = (userData) => {
    const userSchema = zod_1.default.object({
        firstname: zod_1.default.string(),
        lastname: zod_1.default.string()
    });
    try {
        userSchema.parse(userData);
        return true;
    }
    catch (error) {
        return false;
    }
};
module.exports = { generateToken, hashPassword, validateUpdateUserPayload };
