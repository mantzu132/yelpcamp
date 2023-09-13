const mongoose = require("mongoose");
const { db } = require("../models/user");

const dbName = "yelp-camp";
const dbUrl = "mongodb://localhost:27017/" + dbName;
// const dbUrl = process.env.DB_URL;

const connectDB = () => {
  mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true });

  const db = mongoose.connection;

  db.on("error", console.error.bind(console, "MongoDB connection error:"));
  db.once("open", () => {
    console.log("Database connection open");
  });
};

module.exports = connectDB;
