const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');



router.get('/register', (req, res) => {
    res.render('users/register');
});

router.post('/register', async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const user = new User({ username, email });
        const registeredUser = await User.register(user, password);

        // Automatically log the user in after registration
        req.login(registeredUser, function (err) {
            if (err) {
                next(err);
            } else {
                req.flash('success', 'Welcome to Yelp Camp!');
                res.redirect('/campgrounds');
            }
        });

    }

    catch (e) {
        req.flash('danger', e.message);
        res.redirect('/users/register')
    }
})

router.get('/login', (req, res) => {

    res.render('users/login');
});


router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/users/login' }), async (req, res, next) => {
    try {
        req.flash('success', 'Succesfully logged in!');

        res.redirect('/campgrounds');

    }

    catch (e) {
        res.redirect('/users/register')
    }
})

router.get('/logout', function (req, res, next) {
    req.logout(function (err) {
        if (err) { return next(err); }
        res.redirect('/campgrounds');
    });


});


//--------------------------------ROUTES END HERER


module.exports = router;