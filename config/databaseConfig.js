const mongoose = require("mongoose");

const dbName = "yelp-camp"; // Name your database here
const dbUrl = "mongodb://localhost:27017/" + dbName;

const connectDB = () => {
  mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true });

  const db = mongoose.connection;

  db.on("error", console.error.bind(console, "MongoDB connection error:"));
  db.once("open", () => {
    console.log("Database connection open");
  });
};

module.exports = connectDB;
