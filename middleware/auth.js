const config = require('config');
const passport = require('passport');



module.exports = {
    ensureAuthenticated: function (req, res, next) {
        if (req.isAuthenticated()) { return next() }

        res.redirect(301, '/login')

    }
}