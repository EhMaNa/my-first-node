const User = require('../schemas/user');
const express = require('express');
const router = express.Router();
const debug = require('debug')('node:app');
const session = require('express-session');
const flash = require('connect-flash');
const bcrypt = require('bcrypt');
const joi = require('joi');
const { signup, login, logout, dashboard, productsboard, indexPage, userboard } = require('../collections/rendering');
const { genericFlash, conditionalFlash } = require('../middleware/flash-messages');
const { signFlash } = require('../middleware/flash-messages');
const { ensureAuthenticated } = require('../middleware/auth');
const passport = require('passport');
require('../middleware/passport')(passport);
const reqFlashInit = require('../middleware/req-flash-init');
const reqFlash = require('../middleware/req-flash');
const { userboardPost, loginPost } = require('../collections/crud');

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
router.get('/signup', signup);
router.get('/login', login);
router.get('/', indexPage);
router.get('/home/user', userboard);
router.get('/home/products', productsboard);
router.get('/home/dashboard', ensureAuthenticated, dashboard);
router.get('/logout', logout);

// POST ROUTES

// LOGIN
router.post('/login', loginPost);
router.post('/home/user', userboardPost);

// SIGN UP 
router.post('/signup', async (req, res) => {
    const schema = joi.object().keys({
        username: joi.string().trim().min(3).max(20).required(),
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