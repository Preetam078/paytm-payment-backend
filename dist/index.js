"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app = require("./app");
const { PORT } = require("./utils/config");
app.listen(PORT, () => {
    console.log(`connected to ${PORT}`);
});
