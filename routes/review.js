const express = require("express");
const router = express.Router({ mergeParams: true });
// require schema.js for server side validation using joi
const { reviewSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
//require wrapAsync for err handling
const wrapAsync = require("../utils/wrapAsync.js");
//require ExpressCustom Error
const ExpressError = require("../utils/ExpressError.js");

// Create validation middleware for reviews
const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);

  if (error) {
    const errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

// REVIEWS

//Post route
router.post(
  "/",
  validateReview,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    let { review } = req.body;
    let newReview = new Review(review);

    // here we are accessing our reviews array from listing schema.
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    // console.log("new reviewed saved");
    // res.send("new reviewed saved");

    res.redirect(`/listings/${listing._id}`);
  })
);

//Delete review route

router.delete(
  "/:reviewId",
  wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
  })
);

module.exports = router;
