const express = require('express');
const router = express.Router({ mergeParams: true });

const Campground = require('../models/campground');
const Review = require('../models/reviews');

const { reviewSchema } = require('../schemas.js');


const ExpressError = require('../utils/ExpressError');

const middlewares = require('../utils/middlewares');


//-------------------------- REVIEWS ROUTES
router.post('/', middlewares.loggedIn, middlewares.validateRequestBody(reviewSchema), async (req, res, next) => {

    try {
        const review = new Review(req.body.review);
        review.author = req.user._id;

        await review.save();

        const campground = await Campground.findById(req.params.id);

        campground.reviews.push(review);
        await campground.save();
        req.flash('success', "Succesfully created a new review");
        res.redirect(`/campgrounds/${req.params.id}`);
    } catch (e) {
        return next(e);
    }

});


router.delete('/:reviewId', middlewares.loggedIn, middlewares.isAuthor(Review, 'reviewId'), async (req, res, next) => {
    try {
        // Remove the review from the reviews collection
        await Review.findByIdAndDelete(req.params.reviewId);

        // Remove the review from the campground's reviews array
        await Campground.findByIdAndUpdate(req.params.id, {
            $pull: { reviews: { _id: req.params.reviewId } }
        });

        req.flash('success', "Succesfully delete a review");

        res.redirect(`/campgrounds/${req.params.id}`);
    } catch (error) {
        next(error);
    }
});

module.exports = router;