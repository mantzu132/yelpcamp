const mongoose = require('mongoose');
const { campgroundSchema } = require('../schemas');
Review = require('./reviews')

const Schema = mongoose.Schema;

const CampGroundSchema = new Schema({
    title: String,
    image: String,
    price: Number,
    description: String,
    location: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
});

// If we delete a campground delete all reviews
// Mongoose middleware
CampGroundSchema.post('findOneAndDelete', async function(doc, next) {
    console.log(doc);
    if (doc) {
        await Review.deleteMany({ _id: { $in: doc.reviews } });
    }
    next();
});

module.exports = mongoose.model('Campground', CampGroundSchema);