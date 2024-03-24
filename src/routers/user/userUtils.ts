import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
const {JWT_SECRET} = require("../../utils/config")
import zod from "zod"

interface UserUpdatePayload {
    firstname: string,
    lastname: string
}

interface UserTokenPayload {
    id:string, 
    username:string, 
    firstname:string,
    lastname:string
}

const generateToken = (user:UserTokenPayload) => {
    const token = jwt.sign({id:user.id, username:user.username, firstname:user.firstname, lastname:user.lastname}, JWT_SECRET, {expiresIn: "24h"})
    return token
}

const hashPassword = async(password:string) => {
    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword
}

const validateUpdateUserPayload = (userData: UserUpdatePayload) => {
    const userSchema = zod.object({
        firstname:zod.string(),
        lastname:zod.string()
    })
    try {
        userSchema.parse(userData);
        return true;
    } catch (error) {
        return false;
    }
}

module.exports = {generateToken, hashPassword, validateUpdateUserPayload}
