function loggedIn(req, res, next) {
    if (req.user) {
        next();
    } else {
        req.flash('danger', 'You must be logged in to do that');
        res.redirect('/users/login');
    }
}



module.exports = loggedIn;