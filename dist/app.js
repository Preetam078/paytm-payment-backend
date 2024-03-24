"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const accountRouter_1 = require("./routers/account/accountRouter");
const userRouter = require("./routers/user/userRouter");
const cors = require("cors");
// Create an Express application
const app = (0, express_1.default)();
app.use(cors());
app.use(express_1.default.json());
app.use("/api/v1/user", userRouter);
app.use("/api/v1/account", accountRouter_1.accountRouter);
module.exports = app;
