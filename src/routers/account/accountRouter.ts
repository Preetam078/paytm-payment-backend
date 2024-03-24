import express, {Router, Request, Response} from "express"
import { authMiddleware } from "../../utils/middlewares";
import { PrismaClient } from "@prisma/client";
const {errorLog, info} = require("../../utils/logger")

export const accountRouter:Router = express.Router();
const prisma:any = new PrismaClient();

accountRouter.get("/balance", authMiddleware, async(req:Request, res:Response) => {
    try {
        const accountDetails = await prisma.account.findMany({
            where: {
                userId: req.userId
            }
        })
        res.status(200).json({accountDetails})
    } catch (error) {
        errorLog(error)
    }
})

accountRouter.post('/transfer', authMiddleware, async(req:Request, res: Response) => {
    const {recieverId , amount } = req.body

    try {
        const senderAccount = await prisma.account.findMany({
            where:{
                userId: req.userId
            }
        }); 
        const recieverAccount = await prisma.account.findMany({
            where: {
                userId: recieverId
            }
        })
        if(!senderAccount || senderAccount.balance < amount || !recieverAccount) {
            return res.status(201).send("sender has unsufficient account balance or sender/reciever doesnot exist")
        }

        await prisma.$transaction([
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
        ])
        res.status(201).send("transaction done")
    } catch (error) {
        errorLog(error)
        await prisma.$queryRaw('ROLLBACK');
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        // Disconnect Prisma client
        await prisma.$disconnect();
    }
})