const User = require('../schemas/signup');
const express = require('express');
const router = express.Router();
const debug = require('debug')('node:app');
const session = require('express-session');
const flash = require('connect-flash');
const bcrypt = require('bcrypt');
const joi = require('joi');


router.use(session({
    secret: 'secret',
    cookie: { maxAge: 1000 },
    resave: false,
    saveUninitialized: false,
}));
router.use(flash());

router.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next()
})


router.get('/signup', (rq, rs) => {
    rs.render('sign.ejs');
});
router.get('/login', (rq, rs) => {
    rs.render('log.ejs',);
});
router.get('/', (rq, rs) => {
    rs.render('index');
});

// LOGIN
router.post('/login', async (req, res) => {
    const schema = joi.object().keys({
        email: joi.string().trim().email().required(),
        password: joi.string().required()
    });
    const value = schema.validate(req.body);
    debug(value)
    if (value.error) {
        //req.session.message = conditionalFlash(value.error.message)
        res.redirect('/login')
    }
    let valid;
    let user = await User.User.findOne({ email: req.body.email })
    if (!user) {
        req.session.message = genericFlash(2);
        res.status(400).redirect('/login');
    }

    else { valid = await bcrypt.compare(req.body.password, user.password); }
    if (!valid) {
        req.session.message = genericFlash(2);
        res.redirect('/login')
    }
    else {
        /*req.session.message = genericFlash(1);
        const token = jwt.sign({ _id: user._id }, config.get("webToken"))
        req.session.user = token;
        res.redirect(301, '/home');*/

    }

});
module.exports = router;