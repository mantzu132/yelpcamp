const express = require("express");
const app = express();
const engine = require("ejs-mate");
const path = require("path");
const methodOverride = require("method-override");
const morgan = require("morgan");
const configurePassport = require("./config/passportConfig");
const configureSession = require("./config/sessionConfig");
const mongoSanitize = require("express-mongo-sanitize");
const Campground = require("./models/campground");
const configureHelmet = require("./config/helmetConfig");
const flash = require("connect-flash");
const connectDB = require("./config/databaseConfig");
const setupLocals = require("./config/localsConfig");

//----------------------------------------------------------------------------

connectDB();

// Templating and templating engine.
app.engine("ejs", engine);
app.set("view engine", "ejs");

// View folder absolute directory path for consistency
app.set("views", path.join(__dirname, "views"));

// So we get HTML status code with requests in console.
app.use(morgan("dev"));

// For security app.use(helmet)
configureHelmet(app);

// So we can use PUT and DELETE in forms.
app.use(express.urlencoded({ extended: true }));

// So we can edit our campgrounds as HTML forms don't support PUT or DELETE.
app.use(methodOverride("_method"));

// serve static files in public directory
app.use(express.static(path.join(__dirname, "public")));

//sanitize user input to prevent mongo injection
app.use(mongoSanitize());

// Set up session
configureSession(app);

// app.use(passport)
configurePassport(app);

//flashing messages
app.use(flash());

app.use(setupLocals);

//Routers -----------------------------------------------------------------------
const campgroundRoutes = require("./routes/campgroundRoutes");
app.use("/campgrounds", campgroundRoutes);

const reviewRoutes = require("./routes/reviewsRoutes");
app.use("/campgrounds/:id/reviews", reviewRoutes);

const usersRoutes = require("./routes/usersRoutes");
const { connect } = require("http2");
app.use("/users", usersRoutes);

const apiRoutes = require("./routes/apiRoutes");
app.use("/api", apiRoutes);

// ROUTES START HERE---------------------------------------------------

app.get("/", async (req, res, next) => {
  res.render("campgrounds/home");
});

// ROUTES END HERE ---------------------------------------------------

// When we can't find a page pass error to the error handler
app.use((req, res, next) => {
  next(new ExpressError("Sorry, we cannot find that!", 404));
});

// ERROR HANDLER
app.use((err, req, res, next) => {
  if (!err.message) err.message = "Oh no! Something went wrong!";
  const { statusCode = 500 } = err;
  res.status(statusCode).render("error", { err });
});

app.listen(3000, () => {
  console.log(`Success! Your application is running on port 3000.`);
});
