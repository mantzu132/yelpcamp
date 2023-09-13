const session = require("express-session");
const MongoStore = require("connect-mongo");

const dbName = "yelp-camp";
const dbUrl = "mongodb://localhost:27017/" + dbName;

const store = MongoStore.create({
  mongoUrl: dbUrl,
  ttl: 14 * 24 * 60 * 60, // = 14 days. Default
  autoRemove: "native",
});

module.exports = function (app) {
  const sessionConfig = {
    secret: "thisshouldbeabettersecret!",
    resave: false,
    saveUninitialized: true,
    store: store,
    cookie: {
      httpOnly: true,
      expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
  };

  app.use(session(sessionConfig));
};
