const express = require('express');
const mongoose = require('mongoose');
const app = express();
const engine = require('ejs-mate');
const path = require('path');
const methodOverride = require('method-override');
const morgan = require('morgan');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');


// For storing sessions
const session = require('express-session')
const sessionConfig = {
    secret: 'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig))


//Passport authentication
app.use(passport.initialize());
app.use(passport.session()); // Makes passport owrk with express-session^
passport.use(new LocalStrategy(User.authenticate())) // Use the local passport strategy and use this function to authenticate.
//Telling passport how to serialize/deserialize a user object (User.serializeUser() function) ... deserializeUser())
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//flashing messages
const flash = require('connect-flash');
app.use(flash());

//Add the flash messages / current user object to the locals object (so views can access)
app.use((req, res, next) => {
    res.locals.messages = req.flash()
    res.locals.loggedIn = req.isAuthenticated();
    if (req.user) {
        res.locals.userId = req.user._id;
    }
    next();
});


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

// serve static files in public directory
app.use(express.static(path.join(__dirname, 'public')));


//Routers
const campgroundRoutes = require('./routes/campgrounds');
app.use('/campgrounds', campgroundRoutes)

const reviewRoutes = require('./routes/reviews');
app.use('/campgrounds/:id/reviews', reviewRoutes)

const usersRoutes = require('./routes/users');
app.use('/users', usersRoutes)

// ROUTES START HERE---------------------------------------------------




// ROUTES END HERE ---------------------------------------------------


// When we can't find a page pass error to the error handler
// app.use((req, res, next) => {
//     next(new ExpressError('Sorry, we cannot find that!', 404))
// });

// ERROR HANDLER
app.use((err, req, res, next) => {
    if (!err.message) err.message = 'Oh no! Something went wrong!';
    const { statusCode = 500 } = err;
    res.status(statusCode).render('error', { err });
});

app.listen(3000, () => {
    console.log(`Success! Your application is running on port 3000.`);
});

