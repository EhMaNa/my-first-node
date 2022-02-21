
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

const productsboard = (req, res) => {
    if (!req.user) {
        req.flash('error', 'Please Log In to Continue');
        res.redirect('/login');
    } else {
        res.render('products');
    }

}

const indexPage = (req, res) => {
    res.render('index');
}
module.exports = {
    indexPage,
    signup,
    login,
    logout,
    dashboard,
    productsboard,
}