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
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const middlewares_1 = require("../../utils/middlewares");
const { userValidate, SignInUserValidation } = require("../../utils/useValidations");
const { errorLog } = require("../../utils/logger");
const bcrypt_1 = __importDefault(require("bcrypt"));
const { hashPassword, generateToken, validateUpdateUserPayload } = require("./userUtils");
const userRouter = express_1.default.Router();
const prisma = new client_1.PrismaClient();
userRouter.get("/all", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filterData = req.query.filter || "";
    const allUser = yield prisma.user.findMany({
        where: {
            OR: [
                { firstname: { contains: filterData } },
                { lastname: { contains: filterData } },
            ]
        }
    });
    res.send(allUser);
}));
userRouter.post("/signup", userValidate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, firstname, lastname, password } = req.body;
        const hashedPassword = yield hashPassword(password);
        const newUser = yield prisma.user.create({
            data: {
                username,
                firstname,
                lastname,
                password: hashedPassword
            }
        });
        const userId = newUser.id;
        const newAccount = yield prisma.account.create({
            data: {
                userId,
                balance: 1 + Math.random() * 10000
            }
        });
        const signupResponse = {
            userId,
            username: newUser.username,
            firstname: newUser.firstname,
            lastname: newUser.lastname,
            accountId: newAccount.id,
            accountBalance: newAccount.balance
        };
        const token = yield generateToken(signupResponse);
        res.status(201).json({ message: "user created successfully", token });
    }
    catch (error) {
        errorLog(error);
    }
}));
userRouter.post("/signin", SignInUserValidation, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        const fetchedUser = yield prisma.user.findUnique({
            where: {
                username
            }
        });
        if (fetchedUser) {
            // Compare the plaintext password with the hashed password from the database
            const passwordMatch = yield bcrypt_1.default.compare(password, fetchedUser.password);
            if (passwordMatch) {
                // Passwords match, generate and return a JWT token
                //if password matches then we will procced with fetching the account details
                const accountDetails = yield prisma.account.findMany({
                    where: {
                        userId: fetchedUser.id,
                    }
                });
                const loggedInResponse = {
                    userId: fetchedUser.id,
                    username: fetchedUser.username,
                    firstname: fetchedUser.firstname,
                    lastname: fetchedUser.lastname,
                    accountId: accountDetails[0].id,
                    accountBalance: accountDetails[0].balance
                };
                const token = yield generateToken(loggedInResponse);
                return res.status(200).json({ token });
            }
            else {
                // Passwords do not match
                return res.status(401).json({ "errorMessage": "Incorrect username or password." });
            }
        }
        else {
            // User does not exist
            return res.status(404).json({ "errorMessage": "User doesnot exists." });
        }
    }
    catch (error) {
        // Handle any errors that occur during the sign-in process
        console.error("Error signing in:", error);
        return res.status(404).json({ "errorMessage": "Internal server error." });
    }
}));
userRouter.put("/update-user", middlewares_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { firstname, lastname } = req.body;
        const success = yield validateUpdateUserPayload({ firstname, lastname });
        if (!success) {
            return res.status(403).send("please send valid payloads for update user info");
        }
        const updatedUser = yield prisma.user.update({
            where: {
                id: req.userId
            },
            data: {
                firstname,
                lastname
            }
        });
        res.status(201).json({ message: "Updated successfully", updatedUser });
    }
    catch (error) {
        errorLog(error);
    }
}));
module.exports = userRouter;
