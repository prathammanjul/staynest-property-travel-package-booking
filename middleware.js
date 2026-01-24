const Listing = require("./models/listing");
const Review = require("./models/review");
//require ExpressCustom Error
const ExpressError = require("./utils/ExpressError.js");
// require schema.js for server side validation using joi
const { listingSchema, reviewSchema, bookingSchema } = require("./schema.js");
const express = require("express");

module.exports.isLoggedIn = (req, res, next) => {
  // console.log(req.user);
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    // console.log(req.session.redirectUrl);

    req.flash("error", "User must be logged In");
    return res.redirect("/login");
  }
  next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};
// check for the listing owner
module.exports.isOwner = async (req, res, next) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing.owner.equals(res.locals.currUser._id)) {
    req.flash("error", "Your are not authorized to access it");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

// check for the review owner
module.exports.isReviewAuthor = async (req, res, next) => {
  let { id, reviewId } = req.params;
  let review = await Review.findById(reviewId);
  if (!review.author.equals(res.locals.currUser._id)) {
    req.flash("error", "You are not the author of this review");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

// Create validation middleware for Listings
module.exports.validateListing = (req, res, next) => {
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

// Create validation middleware for reviews
module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);

  if (error) {
    const errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

module.exports.isNotOwner = async (req, res, next) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }

  if (listing.owner.equals(req.user._id)) {
    req.flash("error", "Owners cannot book their own listings");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

module.exports.validateBooking = async (req, res, next) => {
  const { error } = bookingSchema.validate(req.body);

  if (error) {
    const errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);

    // const { id } = req.params;
    // const listing = await Listing.findById(id);
    // req.flash("error", "must filled");
    // res.redirect(`/listings/${id}/booking-page`);
  } else {
    next();
  }
};
