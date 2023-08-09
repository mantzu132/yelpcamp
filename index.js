const express = require('express');
const mongoose = require('mongoose');
const app = express();
const path = require('path');
const methodOverride = require('method-override');
const morgan = require('morgan');
const engine = require('ejs-mate');

const Campground = require('./models/campground');
const campground = require('./models/campground');

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

app.get('/', (req, res) => {
    res.render('index', { what: 'best', who: 'me' });
});


app.get('/campgrounds', async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
})

app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new');
});

app.get('/campgrounds/:id', async (req, res) => {
    let campground = await Campground.findById(req.params.id);
    res.render('campgrounds/show', { campground })
})

app.get('/campgrounds/:id/edit', async (req, res) => {
    let campground = await Campground.findById(req.params.id);
    res.render('campgrounds/edit', { campground })
})

app.put('/campgrounds/:id', async (req, res) => {
    const updatedCampground = req.body.campground;
    await Campground.findByIdAndUpdate(req.params.id, updatedCampground);
    res.redirect(`/campgrounds`);
})

app.post('/campgrounds', async (req, res) => {
    // Add a new campground to the database
    console.log(req.body);
    const campground = new Campground(req.body.campground);
    await campground.save();

    // Redirect to the new campground's page
    res.redirect(`/campgrounds/${campground._id}`);
});

app.delete('/campgrounds/:id', async (req, res) => {
    try {
        await Campground.findByIdAndDelete(req.params.id);
        res.redirect('/campgrounds');
    } catch (err) {
        console.error(err);
        res.redirect('/campgrounds');
    }
});

// ROUTES END HERE ---------------------------------------------------
app.use((req, res, next) => {
    res.status(404).send('Sorry, we cannot find that!');
});

app.listen(3000, () => {
    console.log(`Success! Your application is running on port 3000.`);
});



