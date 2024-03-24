import { Express } from "express"
const app:Express = require("./app")
const {PORT} = require("./utils/config")

app.listen(PORT, ():void => {
    console.log(`connected to ${PORT}`)
})