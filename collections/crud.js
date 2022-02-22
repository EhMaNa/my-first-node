const User = require('../schemas/user');
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

module.exports = {
    userboardPost,
}