require('dotenv').config()
const express = require('express');
const router = express.Router();
// Checks if the user is logged in 
const middlewares = require('../utils/middlewares.js')

//Schema for JOI validation
const { campgroundSchema } = require('../schemas.js');

// Mongoose model
const Campground = require('../models/campground.js');

const path = require('path');

const { CloudinaryStorage } = require('multer-storage-cloudinary');

//TO-DO GET THIS OUT OF THIS FILE
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
cloudinary.config({
    cloud_name: process.env.cloud_name,
    api_key: process.env.api_key,
    api_secret: process.env.api_secret
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'YelpCamp',
        allowedFormats: ['jpeg', 'png', 'jpg']
    },
});


const upload = multer({ storage: storage });

// ROUTES ---------------------------------------------------------------

// router.post('/upload', upload.array('image', 10), (req, res) => {
//     if (!req.files || req.files.length === 0) {
//         console.log("No files received");
//         return res.send({
//             success: false
//         });
//     } else {
//         console.log('files received');
//         return res.send(req.files);  // Return the array of files
//     }
// });

router.get('/', async (req, res, next) => {
    try {
        const campgrounds = await Campground.find({});
        res.render('campgrounds/index', { campgrounds });
    } catch (e) {
        return next(e);
    }

});

router.get('/new', middlewares.loggedIn, (req, res) => {
    res.render('campgrounds/new');
});

router.get('/:id', async (req, res, next) => {
    try {
        let campground = await Campground.findById(req.params.id)
            .populate('reviews')
            .populate({
                path: 'reviews',
                populate: {
                    path: 'author',
                    model: 'User'
                }
            })
            .populate('author');
        res.render('campgrounds/show', { campground });

    } catch (e) {
        return next(e);
    }

});


router.get('/:id/edit', middlewares.loggedIn, middlewares.isAuthor(Campground, 'id'), async (req, res, next) => {
    try {
        let campground = await Campground.findById(req.params.id);
        res.render('campgrounds/edit', { campground });
    } catch (e) {
        return next(e);
    }
});

router.put('/:id', middlewares.loggedIn, upload.array('image', 10), middlewares.validateRequestBody(campgroundSchema), async (req, res, next) => {
    try {
        let updatedCampground = await Campground.findById(req.params.id);

        if (!updatedCampground) {
            req.flash('danger', 'Campground not found!');
            return res.redirect(`/campgrounds`);
        }

        if (req.files) {
            let image_data = req.files.map(img => ({
                url: img.path,
                fileName: img.filename
            }));

            updatedCampground.images = image_data;
        }

        Object.assign(updatedCampground, req.body.campground);
        await updatedCampground.save();

        req.flash('success', "Succesfully updated a campground");
        res.redirect(`/campgrounds`);
    } catch (e) {
        return next(e);
    }
});

// To-DO validate image before saving now we are just validating req.body
router.post('/', middlewares.loggedIn, upload.array('image', 10), middlewares.validateRequestBody(campgroundSchema), async (req, res, next) => {

    try {
        // Extract filename and url from req.files that i sent through form (multer middleware)
        let image_data = req.files.map(img => ({
            url: img.path,
            fileName: img.filename
        }));
        campground = new Campground(req.body.campground);
        campground.author = req.user._id;
        campground.images = image_data;
        await campground.save();
        req.flash('success', "Succesfully created a new campground");
        res.redirect(`/campgrounds/${campground._id}`);
    } catch (e) {
        return next(e);
    }

});

router.delete('/:id', middlewares.loggedIn, middlewares.isAuthor(Campground, 'id'), async (req, res, next) => {
    try {
        await Campground.findByIdAndDelete(req.params.id);
        req.flash('success', "Succesfully deleted a campground");
        res.redirect('/campgrounds');
    } catch (e) {
        return next(e);
    }
});


module.exports = router;