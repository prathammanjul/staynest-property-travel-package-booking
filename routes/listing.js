const express = require("express");
const router = express.Router();
//require wrapAsync for err handling
const wrapAsync = require("../utils/wrapAsync.js");
//require ExpressCustom Error
const ExpressError = require("../utils/ExpressError.js");
// require schema.js for server side validation using joi
const { listingSchema, reviewSchema } = require("../schema.js");
const Listing = require("../models/listing.js");

// Create validation middleware for Listings
const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);

  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    // console.log(errMsg);
    // console.log(error.details);
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

// 1. index route -  to show all data.
router.get(
  "/",
  wrapAsync(async (req, res) => {
    const allListings = await Listing.find({}); //SHOW ALL DATA
    res.render("listings/index.ejs", { allListings }); // PASSED allListing
  })
);

// add new listings
router.get("/new", (req, res) => {
  res.render("listings/new.ejs");
});

// show route - for individual id's
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs", { listing });
  })
);

//  create route
router.post(
  "/listings",
  validateListing,
  wrapAsync(async (req, res, next) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
    // console.log(newListing);
  })
);

//EDIT ROUTE
router.get(
  "/:id/edit",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
  })
);

//UPDATE ROUTE
router.put(
  "/:id",
  validateListing,
  wrapAsync(async (req, res) => {
    if (!req.body.listing) {
      throw new ExpressError(400, "Send Valid Data For Listing");
    }
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect("/listings");
  })
);

//DELETE ROUTE
router.delete(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const deleteList = await Listing.findByIdAndDelete(id);
    //   console.log(deleteList);
    res.redirect("/listings");
  })
);

module.exports = router;
