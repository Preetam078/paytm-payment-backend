"use strict";
const info = (...params) => {
    console.log(params);
};
const errorLog = (...params) => {
    console.error(`LOGGING ERROR: ${params}`);
};
module.exports = { info, errorLog };
