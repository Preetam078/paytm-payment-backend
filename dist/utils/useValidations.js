"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = __importDefault(require("zod"));
const userValidationSchema = zod_1.default.object({
    username: zod_1.default.string(),
    firstname: zod_1.default.string(),
    lastname: zod_1.default.string()
});
const SignInUserSchema = zod_1.default.object({
    username: zod_1.default.string(),
    password: zod_1.default.string()
});
const SignInUserValidation = (req, res, next) => {
    const { username, password } = req.body;
    const validationResult = SignInUserSchema.safeParse({ username, password });
    if (validationResult.success) {
        next();
    }
    else {
        res.status(501).send("please enter a valid input for login");
    }
};
function userValidate(req, res, next) {
    const { username, firstname, lastname, password } = req.body;
    const userValidateResult = userValidationSchema.safeParse({ username, firstname, lastname, password });
    if (userValidateResult.success) {
        next();
    }
    else {
        res.status(501).send("please enter a valid payload for user");
    }
}
module.exports = { userValidate, SignInUserValidation };
