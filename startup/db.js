const mongo = require('mongoose');
const winston = require('winston');
const debug = require('debug')('node:app');
require('dotenv').config();

module.exports = function () {
    const db = process.env.MONGO_URI
    mongo.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => {
            debug('Connected Successfully To ' + db)
            winston.info('Connected Successfully To Database')
        })
        .catch(() => {
            debug('An Error Occured Whiles Connecting To Database')
            winston.info('An Error Occured Whiles Connecting To Database')
        })
}