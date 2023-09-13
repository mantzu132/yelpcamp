//Passport authentication
const passport = require("passport");
const User = require("../models/user");
const LocalStrategy = require("passport-local");

module.exports = function (app) {
  app.use(passport.initialize());
  app.use(passport.session()); // Makes passport owrk with express-session^
  passport.use(new LocalStrategy(User.authenticate())); // Use the local passport strategy and use this function to authenticate.
  //Telling passport how to serialize/deserialize a user object (User.serializeUser() function) ... deserializeUser())
  passport.serializeUser(User.serializeUser());
  passport.deserializeUser(User.deserializeUser());
};
