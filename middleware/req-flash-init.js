module.exports = (req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.errors = req.flash('errors');
    res.locals.errorsIntro = req.flash('errorsIntro');
    res.locals.messageIntro = req.flash('messageIntro');
    res.locals.message = req.flash('message');
    delete req.flash();
    next()
}