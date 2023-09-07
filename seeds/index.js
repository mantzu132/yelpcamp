const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelper');
const Campground = require('../models/campground');
const Review = require('../models/reviews');
const User = require('../models/user');


// Delete everything in DB and add in random camp objects
mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async () => {
    await Campground.deleteMany({});
    await Review.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            images: [
                {
                    url: 'https://res.cloudinary.com/debmdj6wp/image/upload/v1693852716/YelpCamp/rpk5rn6wwnjpxu8edaxq.jpg',
                    fileName: 'YelpCamp/rpk5rn6wwnjpxu8edaxq'
                },
                {
                    url: 'https://res.cloudinary.com/debmdj6wp/image/upload/v1693852716/YelpCamp/okjhmydpliaqkir8xrlz.jpg',
                    fileName: 'YelpCamp/okjhmydpliaqkir8xrlz'
                }
            ],
            description: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Officiis veniam animi recusandae possimus minus provident sequi mollitia vel laborum perspiciatis excepturi explicabo, pariatur quis porro veritatis omnis dolor, impedit dignissimos.',
            price,

            author: '64ece77f1e1073e2e1437c00',
            geometry: { type: 'Point', coordinates: [ 25.2829111, 54.6870458 ] }

        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})