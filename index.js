const express = require('express');
const mongoose = require('mongoose');
const app = express();
const path = require('path');
const methodOverride = require('method-override');
const morgan = require('morgan');
const engine = require('ejs-mate');
const ExpressError = require('./utils/ExpressError');

// Mongoose model
const Campground = require('./models/campground');
// JOI SCHEMA
const { campgroundSchema } = require('./schemas');

// DATABASE CONNECTION --------------------------------------------------------------------
const dbName = 'yelp-camp'; // Name your database here
const dbUrl = 'mongodb://localhost:27017/' + dbName;

mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Database connection open');
});

// DATABASE CONNECTION END  --------------------------------------------------------------------

// Templating and templating engine.
app.engine('ejs', engine);
app.set('view engine', 'ejs')


// View folder absolute directory path for consistency
app.set('views', path.join(__dirname, 'views'));

// So we can extract requests body URL encoded data (forms data)
app.use(express.urlencoded({ extended: true }));

// So we get HTML status code with requests in console.
app.use(morgan('dev'));

// So we can use PUT and DELETE in forms.
app.use(express.urlencoded({ extended: true }));

// So we can edit our campgrounds as HTML forms don't support PUT or DELETE.
app.use(methodOverride('_method'))

// ROUTES START HERE---------------------------------------------------


// app.get('/', (req, res) => {
//     res.render('index', { what: 'best', who: 'me' });
// });


app.get('/campgrounds', async (req, res, next) => {
    try {
        const campgrounds = await Campground.find({});
        res.render('campgrounds/index', { campgrounds });
    } catch (e) {
        return next(e);
    }
});

app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new');
});

app.get('/campgrounds/:id', async (req, res, next) => {
    try {
        let campground = await Campground.findById(req.params.id);
        res.render('campgrounds/show', { campground });
        
    } catch (e) {
        return next(e);
    }
    
});

app.get('/campgrounds/:id/edit', async (req, res, next) => {
    try {
        let campground = await Campground.findById(req.params.id);
        res.render('campgrounds/edit', { campground });
    } catch (e) {
        return next(e);
    }
});

app.put('/campgrounds/:id', validateRequestBody, async (req, res, next) => {
    try {
        const updatedCampground = req.body.campground;
        await Campground.findByIdAndUpdate(req.params.id, updatedCampground);
        res.redirect(`/campgrounds`);
    } catch (e) {
        return next(e);
    }
});


app.post('/campgrounds', validateRequestBody, async (req, res, next) => {

    try{
        campground = new Campground(req.body.campground);
        
        await campground.save();
        res.redirect(`/campgrounds/${campground._id}`);
    } catch(e){
        return next(e);
    }
    
});

app.delete('/campgrounds/:id', async (req, res, next) => {
    try {
        await Campground.findByIdAndDelete(req.params.id);
         res.redirect('/campgrounds');
    } catch (e) {
        return next(e);
    }
});

// ROUTES END HERE ---------------------------------------------------

// MIDDLEWARE JOI VALIDATION
function validateRequestBody(req, res, next) {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        return next(new ExpressError(error.details[0].message, 520));
    }
    next();
}

// When we can't find a page pass error to the error handler
app.use((req, res, next) => {
    next(new ExpressError('Sorry, we cannot find that!', 404))
});

// ERROR HANDLER
app.use((err, req, res, next) => {
    if(!err.message) err.message = 'Oh no! Something went wrong!';
    const { statusCode = 500 } = err;
    res.status(statusCode).render('error', {err}); 
});

app.listen(3000, () => {
    console.log(`Success! Your application is running on port 3000.`);
});



