const ExpressError = require('./ExpressError');


function validateRequestBody(schema) {
    return (req, res, next) => {
        const { error } = schema.validate(req.body);
        if (error) {
            return next(new ExpressError(error.details[0].message, 400));
        }
        next();
    };
}

module.exports = validateRequestBody;