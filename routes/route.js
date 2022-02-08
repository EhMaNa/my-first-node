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
const reqFlashInit = require('../middleware/req-flash-init');
const reqFlash = require('../middleware/req-flash');

router.use(session({
    secret: 'secret',
    cookie: { maxAge: null },
    resave: true,
    saveUninitialized: true,
}));
router.use(passport.initialize());
router.use(passport.session());
router.use(flash());
router.use(reqFlashInit)

//  GET ROUTES
router.get('/signup', (req, res) => {
    res.render('sign');
});
router.get('/login', (req, res) => {
    rs.render('log',);
});
router.get('/', (rq, rs) => {
    rs.render('index');
});
router.get('/home/user', (req, res) => {
    if (!req.user) {
        req.flash('error', 'Please Log In to Continue');
        res.redirect('/login');
    } else {
        res.render('user', {
            name: req.user.username,
            email: req.user.email
        });
    }
});
router.get('/home/products', (req, res) => {
    if (!req.user) {
        req.flash('error', 'Please Log In to Continue');
        res.redirect('/login');
    } else {
        res.render('products');
    }

});
router.get('/home/dashboard', ensureAuthenticated, (rq, rs) => {
    rs.render('dashboard');
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
        reqFlash(req, genericFlash(2), 'messageIntro', 'message');
        res.redirect('/login')
    } else {
        passport.authenticate('local', {
            successRedirect: '/home/dashboard',
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
        reqFlash(req, conditionalFlash(value.error.message), 'errorsIntro', 'errors');
        res.status(400).redirect('/signup');
    }
    else if (req.body.password != req.body.password_repeat) {
        reqFlash(req, genericFlash(4), 'messageIntro', 'message');
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
            reqFlash(req, signFlash(error.message), 'errorsIntro', 'errors');
            res.redirect(302, '/signup')
        }

    }



});
module.exports = router;