const express = require("express");
const router = express.Router({ mergeParams: true });

//require wrapAsync for err handling
const wrapAsync = require("../utils/wrapAsync.js");
//require ExpressCustom Error
const ExpressError = require("../utils/ExpressError.js");
const {
  isLoggedIn,
  validateReview,
  isReviewAuthor,
} = require("../middleware.js");

const packageReviewsController = require("../controllers/packageReviews.js");

router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(packageReviewsController.postReview),
);

router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(packageReviewsController.destroyReview),
);

module.exports = router;
