const info = (...params:any[]) => {
    console.log(params)
}

const errorLog = (...params: any[]) => {
    console.error(`LOGGING ERROR: ${params}`);
};

module.exports = {info, errorLog}