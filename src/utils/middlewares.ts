import {Request, Response, NextFunction} from "express"
import jwt from "jsonwebtoken"
const {JWT_SECRET} = require("../utils/config")
const {errorLog} = require("../utils/logger")

declare global {
    namespace Express {
        interface Request {
            userId? : string
        }
    }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(403).json({ error: 'Unauthorized' });
        }
    
        const token = authHeader.split(' ')[1];
        const decodedData = jwt.verify(token, JWT_SECRET) as { id: string, username: string };
        console.log(decodedData)
        req.userId = decodedData.id
        next();
    } catch (error) {
        errorLog(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};