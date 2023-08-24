const express = require('express');
const router = express.Router();

//Schema for JOI validation
const { campgroundSchema } = require('../schemas.js');

const ExpressError = require('../utils/ExpressError.js');

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

router.get('/new', (req, res) => {
    res.render('campgrounds/new');
});

router.get('/:id', async (req, res, next) => {
    try {
        let campground = await Campground.findById(req.params.id).populate('reviews');
        res.render('campgrounds/show', { campground });

    } catch (e) {
        return next(e);
    }

});

router.get('/:id/edit', async (req, res, next) => {
    try {
        let campground = await Campground.findById(req.params.id);
        res.render('campgrounds/edit', { campground });
    } catch (e) {
        return next(e);
    }
});


router.put('/:id', validateRequestBody(campgroundSchema), async (req, res, next) => {
    try {
        const updatedCampground = req.body.campground;
        await Campground.findByIdAndUpdate(req.params.id, updatedCampground);
        req.flash('success', "Succesfully updated a campground");
        res.redirect(`/campgrounds`);
    } catch (e) {
        return next(e);
    }
});

router.post('/', validateRequestBody(campgroundSchema), async (req, res, next) => {

    try {
        campground = new Campground(req.body.campground);

        await campground.save();
        req.flash('success', "Succesfully created a new campground");
        res.redirect(`/campgrounds/${campground._id}`);
    } catch (e) {
        return next(e);
    }

});

router.delete('/:id', async (req, res, next) => {
    try {
        await Campground.findByIdAndDelete(req.params.id);
        req.flash('success', "Succesfully deleted a campground");
        res.redirect('/campgrounds');
    } catch (e) {
        return next(e);
    }
});


module.exports = router;