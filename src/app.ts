import express, { Express, Request, Response } from 'express';
import { accountRouter } from './routers/account/accountRouter';
const userRouter = require("./routers/user/userRouter")
const cors = require("cors")
// Create an Express application
const app:Express = express();
app.use(cors())
app.use(express.json())

app.use("/api/v1/user", userRouter)
app.use("/api/v1/account", accountRouter)
module.exports = app
