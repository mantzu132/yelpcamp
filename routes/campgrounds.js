const express = require('express');
const router = express.Router();
// Checks if the user is logged in 
const loggedIn = require('../utils/middlewares.js')

//Schema for JOI validation
const { campgroundSchema } = require('../schemas.js');

// Mongoose model
const Campground = require('../models/campground.js');

// For validating our data with JOI schema.
const validateRequestBody = require('../utils/validateRequestBody.js');

// ROUTES ---------------------------------------------------------------


router.get('/', async (req, res, next) => {
    try {
        const campgrounds = await Campground.find({});
        res.render('campgrounds/index', { campgrounds });
    } catch (e) {
        return next(e);
    }

});

router.get('/new', loggedIn, (req, res) => {
    res.render('campgrounds/new');
});

router.get('/:id', async (req, res, next) => {
    try {
        let campground = await Campground.findById(req.params.id).populate('reviews').populate('author');
        console.log(campground)
        res.render('campgrounds/show', { campground });

    } catch (e) {
        return next(e);
    }

});

router.get('/:id/edit', loggedIn, async (req, res, next) => {
    try {
        let campground = await Campground.findById(req.params.id);
        res.render('campgrounds/edit', { campground });
    } catch (e) {
        return next(e);
    }
});


router.put('/:id', loggedIn, validateRequestBody(campgroundSchema), async (req, res, next) => {
    try {
        const updatedCampground = req.body.campground;
        await Campground.findByIdAndUpdate(req.params.id, updatedCampground);
        req.flash('success', "Succesfully updated a campground");
        res.redirect(`/campgrounds`);
    } catch (e) {
        return next(e);
    }
});

router.post('/', loggedIn, validateRequestBody(campgroundSchema), async (req, res, next) => {

    try {
        console.log(req.body.campground)
        campground = new Campground(req.body.campground);
        campground.author = req.user._id;

        await campground.save();
        req.flash('success', "Succesfully created a new campground");
        res.redirect(`/campgrounds/${campground._id}`);
    } catch (e) {
        return next(e);
    }

});

router.delete('/:id', loggedIn, async (req, res, next) => {
    try {
        await Campground.findByIdAndDelete(req.params.id);
        req.flash('success', "Succesfully deleted a campground");
        console.log('About to redirect to /campgrounds');
        res.redirect('/campgrounds');
    } catch (e) {
        return next(e);
    }
});


module.exports = router;