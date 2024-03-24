import zod from "zod"
import {Request, Response, NextFunction} from "express"

const userValidationSchema = zod.object({
    username:zod.string(), 
    firstname:zod.string(),
    lastname: zod.string()
})

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
module.exports = {userValidate}