import zod from "zod"
import {Request, Response, NextFunction} from "express"

const userValidationSchema = zod.object({
    username:zod.string(), 
    firstname:zod.string(),
    lastname: zod.string()
})

const SignInUserSchema = zod.object({
    username: zod.string(),
    password: zod.string()
})

const SignInUserValidation = (req: Request, res:Response, next:NextFunction) => {
    const {username, password} = req.body
    const validationResult = SignInUserSchema.safeParse({username, password})
    if(validationResult.success) {
        next() 
    }
    else {
        res.status(501). send("please enter a valid input for login")
    }
}

function userValidate(req:Request, res:Response, next:NextFunction){
    const{username, firstname, lastname, password} = req.body
    const userValidateResult = userValidationSchema.safeParse({username, firstname, lastname, password})
    if(userValidateResult.success) {
        next()
    }
    else {
        res.status(501).send("please enter a valid payload for user")
    }
}
module.exports = {userValidate, SignInUserValidation}