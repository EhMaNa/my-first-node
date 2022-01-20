const winston = require('winston');
const debug = require('debug')('node:app');

module.exports = function (error, req, res, next) {
    winston.error(error.message, error)
    debug('An Unexpected Error Occured')
    res.status(500).end();//send('An Unexpected Error Occured');

};

/*function asyncError (handler) {
    return async (req, res, next) => {
    try {
        await handler;
    } catch (error) {
        console.log('i am working ')
        next(error)
    }
}
}*/