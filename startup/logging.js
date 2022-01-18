const winston = require('winston');


module.exports = function () {
    process.on('uncaughtException', (ex) => {
        winston.error(ex.message, ex)
    })
    process.on('unhandledRejection', (ex) => {
        winston.error(ex.message, ex)
    })
    winston.add(new winston.transports.File({ filename: 'logfile.log', level: 'info' }));
}