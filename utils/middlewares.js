const ExpressError = require('./ExpressError');

const Campground = require('../models/campground');
function loggedIn(req, res, next) {
    if (req.user) {
        next();
    } else {
        req.flash('danger', 'You must be logged in to do that');
        res.redirect('/users/login');
    }
}

const isAuthor = (Model) => {
    return async (req, res, next) => {
        try {
            const doc = await Model.findById(req.params.reviewId);

            if (!doc) {
                const err = new Error('Resource not found!');
                err.statusCode = 404;
                return next(err);
            }

            if (!doc.author.equals(req.user._id)) {
                req.flash('danger', 'You do not have permission to do that!');
                return res.redirect(`/campgrounds/${req.params.id}`);
            }

            next();
        } catch (error) {
            next(error);
        }
    };
};



//Validates the request body against the JOI schema
function validateRequestBody(schema) {
    return (req, res, next) => {
        const { error } = schema.validate(req.body);
        if (error) {
            return next(new ExpressError(error.details[0].message, 400));
        }
        next();
    };
}


module.exports = { loggedIn, isAuthor, validateRequestBody };