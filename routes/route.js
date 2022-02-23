const express = require('express');
const router = express.Router();
const debug = require('debug')('node:app');
const session = require('express-session');
const flash = require('connect-flash');
const { signup, login, logout, dashboard, productsboard, indexPage, userboard } = require('../collections/rendering');
const { genericFlash, conditionalFlash } = require('../middleware/flash-messages');
const { signFlash } = require('../middleware/flash-messages');
const { ensureAuthenticated } = require('../middleware/auth');
const passport = require('passport');
require('../middleware/passport')(passport);
const reqFlashInit = require('../middleware/req-flash-init');
const { userboardPost, loginPost, signupPost } = require('../collections/crud');

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
router.post('/signup', signupPost);

module.exports = router;