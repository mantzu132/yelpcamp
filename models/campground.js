const mongoose = require('mongoose');
const Review = require('./reviews')



const Schema = mongoose.Schema;

const CampGroundSchema = new Schema({
    title: String,
    price: Number,
    description: String,
    location: String,
    images: [
        {
            _id: false,
            url: String,
            fileName: String
        }
    ],
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
});

// If we delete a campground delete all reviews
// Mongoose middleware
CampGroundSchema.post('findOneAndDelete', async function (doc, next) {
    if (doc) {
        await Review.deleteMany({ _id: { $in: doc.reviews } });
    }
    next();
});

module.exports = mongoose.model('Campground', CampGroundSchema);