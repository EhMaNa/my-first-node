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

module.exports = {
    userboardPost,
    loginPost,
}