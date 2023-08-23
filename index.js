const express = require('express');
const mongoose = require('mongoose');
const app = express();
const engine = require('ejs-mate');
const path = require('path');
const methodOverride = require('method-override');
const morgan = require('morgan');


//flashing messages
const flash = require('connect-flash');
app.use(flash());
// For storing sessions
const session = require('express-session')
app.use(session({secret : 'devsecret'}));

//Parsing cookies
const cookieParser = require('cookie-parser');
app.use(cookieParser());

// Mongoose model
// const Review = require('./models/reviews');
// const Campground = require('./models/campground')
// const ExpressError = require('./utils/ExpressError');


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

// So we get HTML status code with requests in console.
app.use(morgan('dev'));

// So we can use PUT and DELETE in forms.
app.use(express.urlencoded({ extended: true }));

// So we can edit our campgrounds as HTML forms don't support PUT or DELETE.
app.use(methodOverride('_method'))


//Routers
const campgrounds = require('./routes/campgrounds');
app.use('/campgrounds', campgrounds)

const reviews = require('./routes/reviews');
app.use('/campgrounds/:id/reviews', reviews)

// ROUTES START HERE---------------------------------------------------


app.get('/', (req, res) => {
    console.log(Review)
});


// ROUTES END HERE ---------------------------------------------------


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

