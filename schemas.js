// Data validation with Joi
const BaseJoi = require("joi");
const sanitizeHtml = require("sanitize-html");

// EXTENSION FOR SANITIZING HTML
const extension = {
  type: "string",
  base: BaseJoi.string(),
  messages: {
    "string.sanitize": "{{#label}} must not contain HTML",
  },
  rules: {
    sanitize: {
      validate(value, helpers) {
        const clean = sanitizeHtml(value);
        if (clean !== value) {
          return helpers.error("string.sanitize", { value });
        }
        return clean; // Always return the sanitized version.
      },
    },
  },
};

const Joi = BaseJoi.extend(extension);

module.exports.campgroundSchema = Joi.object({
  campground: Joi.object({
    title: Joi.string().required().sanitize(),
    price: Joi.number().required().min(0),
    location: Joi.string().required().sanitize(),
    description: Joi.string().required().sanitize(),
  }).required(),
  deleteImages: Joi.array().items(Joi.string()),
});

module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().required().min(1).max(5),
    body: Joi.string().required().sanitize(),
  }).required(),
});
