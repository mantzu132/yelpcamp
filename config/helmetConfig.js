const helmet = require("helmet");

const scriptSrcUrls = [
  "https://stackpath.bootstrapcdn.com/",
  "https://api.tiles.mapbox.com/",
  "https://api.mapbox.com/",
  "https://kit.fontawesome.com/",
  "https://cdnjs.cloudflare.com/",
  "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
  "https://kit-free.fontawesome.com/",
  "https://stackpath.bootstrapcdn.com/",
  "https://api.mapbox.com/",
  "https://api.tiles.mapbox.com/",
  "https://fonts.googleapis.com/",
  "https://use.fontawesome.com/",
  "https://cdn.jsdelivr.net/",
];
const connectSrcUrls = [
  "https://api.mapbox.com/",
  "https://a.tiles.mapbox.com/",
  "https://b.tiles.mapbox.com/",
  "https://events.mapbox.com/",
];
const fontSrcUrls = [];

module.exports = function (app) {
  app.use(
    helmet({
      contentSecurityPolicy: false, // this disables the default CSP from helmet
    })
  );

  app.use(
    helmet.contentSecurityPolicy({
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", ...scriptSrcUrls],
        styleSrc: ["'self'", ...styleSrcUrls],
        imgSrc: [
          "'self'",
          "data:",
          "https://res.cloudinary.com",
          "https://images.unsplash.com",
        ],
        connectSrc: ["'self'", ...connectSrcUrls],
        fontSrc: ["'self'", ...fontSrcUrls],
        workerSrc: ["'self'", "blob:"],
        childSrc: ["blob:"],
        objectSrc: [],
        upgradeInsecureRequests: [],
      },
    })
  );
};
