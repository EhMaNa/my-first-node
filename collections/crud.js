const User = require('../schemas/user');
const joi = require('joi');
const passport = require('passport');
const reqFlash = require('../middleware/req-flash');
const { genericFlash, conditionalFlash } = require('../middleware/flash-messages');
const debug = require('debug')('node:app');



const userboardPost = async (req, res) => {
    const user = await User.User.findByIdAndUpdate(req.user.id, {
        $set: {
            username: req.body.username,
            Fname: req.body.Fname,
            Lname: req.body.Lname,
            bio: req.body.bio,
        },
    }, { new: true })
    debug(user);
    res.redirect('/home/user')
}

const loginPost = async (req, res, next) => {
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

}

const signupPost = async (req, res) => {
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
}

module.exports = {
    userboardPost,
    loginPost,
}