"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const { JWT_SECRET } = require("../utils/config");
const { errorLog } = require("../utils/logger");
const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(403).json({ error: 'Unauthorized' });
        }
        const token = authHeader.split(' ')[1];
        const decodedData = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        console.log(decodedData);
        req.userId = decodedData.id;
        next();
    }
    catch (error) {
        errorLog(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};
exports.authMiddleware = authMiddleware;
