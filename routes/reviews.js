const express = require('express');
const router = express.Router({ mergeParams: true });

const Campground = require('../models/campground');
const Review = require('../models/reviews');

const { reviewSchema } = require('../schemas.js');


const ExpressError = require('../utils/ExpressError');

// For validating our data with JOI schema.
const validateRequestBody = require('../utils/validateRequestBody.js');


//-------------------------- REVIEWS ROUTES
router.post('/', validateRequestBody(reviewSchema), async (req, res, next) => {

    try{
        const review = new Review(req.body.review);

        await review.save();

        const campground = await Campground.findById(req.params.id); 

        campground.reviews.push(review);
        await campground.save();

        res.redirect(`/campgrounds/${req.params.id}`);
    } catch(e){
        return next(e);
    }
    
});

router.delete('/:reviewId', async (req, res, next) => {
    try {
        // Remove the review from the reviews collection
        await Review.findByIdAndDelete(req.params.reviewId);

        // Remove the review from the campground's reviews array
        await Campground.findByIdAndUpdate(req.params.id, {
            $pull: { reviews: { _id: req.params.reviewId } }
        });

        res.redirect(`/campgrounds/${req.params.id}`);
    } catch (error) {
        next(error);
    }
});

module.exports = router;