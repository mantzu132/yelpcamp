const mongoose = require('mongoose');
const Review = require('./reviews')



const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    _id: false,
    url: String,
    fileName: String     
})

const CampGroundSchema = new Schema({
    title: String,
    price: Number,
    description: String,
    location: String,
    images: [ImageSchema],
    geometry: {
        type: {
            type: String, 
            enum: ['Point'], 
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
  },
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

// Adding virtual property so all of our images will have a thumbnail
ImageSchema.virtual('thumbnail').get(function() {
    return this.url ? this.url.replace('/upload', '/upload/w_200') : null;
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