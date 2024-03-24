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
const { userValidate } = require("../../utils/useValidations");
const { errorLog } = require("../../utils/logger");
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
        yield prisma.account.create({
            data: {
                userId,
                balance: 1 + Math.random() * 10000
            }
        });
        const token = yield generateToken(newUser);
        res.status(201).json({ message: "user created successfully", token });
    }
    catch (error) {
        errorLog(error);
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
