const User = require('../schemas/user');



const userboardPost = async (req, res) => {
    const user = await User.User.findByIdAndUpdate(req.user.id, {
        $set: {
            Fname: req.body.Fname,
            Lname: req.body.Lname,
            bio: req.body.bio,
        },
    }, { new: true })
    console.log(user);
    res.redirect('/home/user')
}

module.exports = {
    userboardPost,
}