
const signup = (req, res) => {
    res.render('sign');
}

const login = (req, res) => {
    res.render('log',);
}

module.exports = {
    signup,
    login,
}