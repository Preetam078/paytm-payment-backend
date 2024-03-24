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
exports.accountRouter = void 0;
const express_1 = __importDefault(require("express"));
const middlewares_1 = require("../../utils/middlewares");
const client_1 = require("@prisma/client");
const { errorLog, info } = require("../../utils/logger");
exports.accountRouter = express_1.default.Router();
const prisma = new client_1.PrismaClient();
exports.accountRouter.get("/balance", middlewares_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const accountDetails = yield prisma.account.findMany({
            where: {
                userId: req.userId
            }
        });
        res.status(200).json({ accountDetails });
    }
    catch (error) {
        errorLog(error);
    }
}));
exports.accountRouter.post('/transfer', middlewares_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { recieverId, amount } = req.body;
    try {
        const senderAccount = yield prisma.account.findMany({
            where: {
                userId: req.userId
            }
        });
        const recieverAccount = yield prisma.account.findMany({
            where: {
                userId: recieverId
            }
        });
        if (!senderAccount || senderAccount.balance < amount || !recieverAccount) {
            return res.status(201).send("sender has unsufficient account balance or sender/reciever doesnot exist");
        }
        yield prisma.$transaction([
            // debiting amount from sender account
            prisma.account.update({
                where: {
                    userId: req.userId
                },
                data: {
                    balance: {
                        decrement: amount
                    }
                }
            }),
            // crediting amount to reciver account
            prisma.account.update({
                where: {
                    userId: recieverId
                },
                data: {
                    balance: {
                        increment: amount
                    }
                }
            })
        ]);
        res.status(201).send("transaction done");
    }
    catch (error) {
        errorLog(error);
        yield prisma.$queryRaw('ROLLBACK');
        res.status(500).json({ error: 'Internal server error' });
    }
    finally {
        // Disconnect Prisma client
        yield prisma.$disconnect();
    }
}));
