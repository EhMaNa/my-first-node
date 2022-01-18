const helmet = require('helmet')
const comp = require('compression');

module.exports = function (app) {
    app.use(helmet())
    app.use(comp())

}