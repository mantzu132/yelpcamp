const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');

router.get('/register', (req, res) => {
    res.render('users/register');
});

// router.post('/register', async (req, res, next) => {
//     try {

//     } catch (e) {

//     }
// });

module.exports = router;