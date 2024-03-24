import * as dotenv from "dotenv"
dotenv.config()
const PORT = process.env.PORT || 5002
const JWT_SECRET = process.env.JWT_SECRET || "random-server"

module.exports = {PORT, JWT_SECRET}