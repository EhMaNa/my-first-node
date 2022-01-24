const User = require('../schemas/signup');
const express = require('express');
const router = express.Router();
const app = express();
const debug = require('debug')('node:app');
const session = require('express-session');
const flash = require('connect-flash');
const bcrypt = require('bcrypt');
const joi = require('joi');
const { genericFlash, conditionalFlash } = require('../middleware/flash');
const { signFlash } = require('../middleware/flash');
const { ensureAuthenticated } = require('../middleware/auth');
const passport = require('passport');
require('../middleware/passport')(passport);


router.use(session({
    secret: 'secret',
    cookie: { maxAge: 1000 },
    resave: false,
    saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());
router.use(flash());

router.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
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
router.get('/try', function (req, res, next) {
    if (req.isAuthenticated) {
        debug(req.isAuthenticated)
        return next()
    }
    debug(req.isAuthenticated)
    res.redirect(301, '/login')

}, (rq, rs) => {
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
    }
    /*let valid;
    let user = await User.User.findOne({ email: req.body.email })
    if (!user) {
        //req.session.message = genericFlash(2);
        const msg = genericFlash(2);
        req.flash('messageIntro', msg.intro);
        req.flash('message', msg.message);
        res.status(400).redirect('/login');
    }

    else { valid = await bcrypt.compare(req.body.password, user.password); }

    if (!valid) {
        //req.session.message = genericFlash(2);
        res.redirect('/login')
    }*/
    else {
        passport.authenticate('local', {
            successRedirect: '/try',
            failureRedirect: '/login',
            failureFlash: true,
        })(req, res, next);


    }

});
module.exports = router;