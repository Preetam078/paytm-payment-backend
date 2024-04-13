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
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const { JWT_SECRET } = require("../utils/config");
const { errorLog } = require("../utils/logger");
const authMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(403).json({ error: 'Unauthorized' });
        }
        const token = authHeader.split(' ')[1];
        const decodedData = yield jsonwebtoken_1.default.verify(token, JWT_SECRET);
        console.log("getting decoded Data.....", decodedData);
        req.userId = decodedData.userId;
        console.log("before leaving middleware.....", req.userId);
        next();
    }
    catch (error) {
        errorLog(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
exports.authMiddleware = authMiddleware;
