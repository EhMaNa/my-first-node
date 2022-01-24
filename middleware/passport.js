const localStrategy = require('passport-local').Strategy;
const User = require('../schemas/signup');
const bcrypt = require('bcrypt');


module.exports = function (passport) {
    passport.use(
        new localStrategy({ usernameField: 'email' }, async (email, password, done) => {
            const user = await User.User.findOne({ email: email });
            if (!user) {
                return done(null, false, { message: "Incorrect Email or Password" })
            }

            let valid = await bcrypt.compare(password, user.password);
            if (!valid) {
                return done(null, false, { message: "Incorrect Email or Password" });
            } else {
                return done(null, user)
            }
        })
    )
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        User.User.findById(id, function (err, user) {
            done(err, user);
        });
    });

}