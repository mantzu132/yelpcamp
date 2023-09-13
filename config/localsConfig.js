const setupLocals = (req, res, next) => {
  res.locals.messages = req.flash();
  res.locals.loggedIn = req.isAuthenticated();
  if (req.user) {
    res.locals.userId = req.user._id;
  }
  next();
};

module.exports = setupLocals;
