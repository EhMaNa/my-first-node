
const signup = (req, res) => {
    res.render('sign');
}

const login = (req, res) => {
    res.render('log',);
}

const logout = (req, res) => {
    req.logout();
    res.redirect('/');
}

const dashboard = (req, res) => {
    res.render('dashboard');
}
module.exports = {
    signup,
    login,
    logout,
    dashboard,
}