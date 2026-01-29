const Review = require("../models/review.js");
const Listing = require("../models/listing.js");

// Create Review
module.exports.createReview = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  // 🚫 BLOCK: Owner cannot review own listing
  if (listing.owner.equals(req.user._id)) {
    req.flash("error", "You cannot review your own listing!");
    return res.redirect(`/listings/${listing._id}`);
  }

  let { review } = req.body;
  let newReview = new Review(review);
  newReview.author = req.user._id;

  // console.log(newReview);
  // here we are accessing our reviews array from listing schema.
  listing.reviews.push(newReview);

  await newReview.save();
  await listing.save();

  // console.log("new reviewed saved");
  // res.send("new reviewed saved");
  req.flash("success", "Review added!");

  res.redirect(`/listings/${listing._id}`);
};

// Destroy review
module.exports.destroyReview = async (req, res) => {
  let { id, reviewId } = req.params;
  // remove the review id (reference) from the listing's reviews array
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  // delete the actual review document from Review collection
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Review Deleted!");
  res.redirect(`/listings/${id}`);
};
