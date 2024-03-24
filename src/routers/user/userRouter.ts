import express, {Router, Request, Response} from "express"
import { PrismaClient } from "@prisma/client"
import { authMiddleware } from "../../utils/middlewares"
const {userValidate} = require("../../utils/useValidations")
const {errorLog} = require("../../utils/logger")
const {hashPassword, generateToken, validateUpdateUserPayload} = require("./userUtils")

const userRouter:Router = express.Router()
const prisma:any = new PrismaClient();

userRouter.get("/all", async(req:Request, res:Response) => {
    const filterData = req.query.filter || "";
    const allUser = await prisma.user.findMany({
        where: {
            OR:[
                {firstname: {contains: filterData as string}},
                {lastname: {contains: filterData as string}},
            ]
        }
    });
    res.send(allUser)
})

userRouter.post("/signup",userValidate, async(req:Request, res:Response) => {
    try {
        const {username, firstname, lastname, password} = req.body
        const hashedPassword = await hashPassword(password)
        const newUser = await prisma.user.create({
            data: {
                username, 
                firstname, 
                lastname,
                password:hashedPassword
            }
        })
        const userId = newUser.id
        await prisma.account.create({
            data: {
                userId,
                balance: 1 + Math.random()* 10000
            }
        })

        const token = await generateToken(newUser)
        res.status(201).json({message:"user created successfully",token})

    } catch (error) {
        errorLog(error)
    }
})

userRouter.put("/update-user", authMiddleware, async(req:Request, res:Response) => {
    try {
        const {firstname, lastname} = req.body
        const success = await validateUpdateUserPayload({firstname, lastname})
        if(!success) {
            return res.status(403).send("please send valid payloads for update user info")
        }
        const updatedUser = await prisma.user.update({
            where:{
                id:req.userId
            },
            data: {
                firstname, 
                lastname
            }
        })
        res.status(201).json({message:"Updated successfully", updatedUser})
    } catch (error) {
        errorLog(error)
    }

})

module.exports = userRouter