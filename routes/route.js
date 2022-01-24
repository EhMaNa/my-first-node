const User = require('../schemas/signup');
const express = require('express');
const router = express.Router();
const debug = require('debug')('node:app');
const session = require('express-session');
const flash = require('connect-flash');
const bcrypt = require('bcrypt');
const joi = require('joi');
const { genericFlash, conditionalFlash } = require('../middleware/flash-messages');
const { signFlash } = require('../middleware/flash-messages');
const { ensureAuthenticated } = require('../middleware/auth');
const passport = require('passport');
require('../middleware/passport')(passport);


router.use(session({
    secret: 'secret',
    cookie: { maxAge: null },
    resave: true,
    saveUninitialized: true,
}));
router.use(passport.initialize());
router.use(passport.session());
router.use(flash());

router.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.errors = req.flash('errors');
    res.locals.errorsIntro = req.flash('errorsIntro');
    res.locals.messageIntro = req.flash('messageIntro');
    res.locals.message = req.flash('message');
    delete req.flash();
    next()
})

//  GET ROUTES
router.get('/signup', (rq, rs) => {
    rs.render('sign');
});
router.get('/login', (rq, rs) => {
    rs.render('log',);
});
router.get('/home', (rq, rs) => {
    rs.render('index');
});
router.get('/', (rq, rs) => {
    rs.render('index');
});
router.get('/users/home', ensureAuthenticated, (rq, rs) => {
    rs.send('index');
});
router.get('/logout', (rq, rs) => {
    rq.logout();
    rs.redirect('/');
});

// POST ROUTES

// LOGIN
router.post('/login', async (req, res, next) => {
    const schema = joi.object().keys({
        email: joi.string().trim().email().required(),
        password: joi.string().required()
    });
    const value = schema.validate(req.body);
    debug(value)
    if (value.error) {
        const msg = genericFlash(2);
        req.flash('messageIntro', msg.intro);
        req.flash('message', msg.message);
        res.redirect('/login')
    } else {
        passport.authenticate('local', {
            successRedirect: '/users/home',
            failureRedirect: '/login',
            failureFlash: true,
        })(req, res, next);


    }

});

// SIGN UP 
router.post('/signup', async (req, res) => {
    const schema = joi.object().keys({
        username: joi.string().trim().min(3).max(50).required(),
        email: joi.string().trim().email().required(),
        password: joi.string().min(7).required(),
        password_repeat: joi.string(),
    });
    const value = schema.validate(req.body);
    debug(value)
    if (value.error) {
        const msg = conditionalFlash(value.error.message);
        req.flash('errorsIntro', msg.intro);
        req.flash('errors', msg.message);
        res.status(400).redirect('/signup');
    }
    else if (req.body.password != req.body.password_repeat) {
        const msg = genericFlash(4);
        req.flash('messageIntro', msg.intro);
        req.flash('message', msg.message);
        res.status(400).redirect('/signup');
    }
    else {
        let user = new User.User({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password
        })
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt)
        try {
            user = await user.save()
            const msg = genericFlash(3);
            req.flash('success', msg.intro);
            debug(user)
            res.redirect(302, '/login');
            res.end();
        } catch (error) {
            const msg = signFlash(error.message);
            req.flash('errorsIntro', msg.intro);
            req.flash('errors', msg.message);
            res.redirect(302, '/signup')
        }

    }



});
module.exports = router;