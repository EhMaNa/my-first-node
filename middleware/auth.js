module.exports = {
    ensureAuthenticated: function (req, res, next) {
        if (req.isAuthenticated()) {
            return next()
        }
        req.flash('error', 'Please Log In to Continue')
        res.redirect(301, '/login')

    }
}