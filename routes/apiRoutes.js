const express = require("express");
const router = express.Router();
const Campground = require("../models/campground");

router.get("/campgrounds", async (req, res, next) => {
  try {
    const campgrounds = await Campground.find({});
    const data = {
      campgrounds,
      environmentVariable: process.env.MAPBOX_TOKEN,
    };
    res.json(data);
  } catch (e) {
    return next(e);
  }
});

router.get("/campground/:id", async (req, res, next) => {
  try {
    const campground = await Campground.findById(req.params.id);
    if (!campground) {
      return res.status(404).json({ error: "Campground not found" });
    }
    const data = {
      campground,
      mapboxToken: process.env.MAPBOX_TOKEN,
    };
    res.json(data);
  } catch (e) {
    return next(e);
  }
});

module.exports = router;
