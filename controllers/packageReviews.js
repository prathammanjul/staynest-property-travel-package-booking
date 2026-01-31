const Review = require("../models/review.js");
const Package = require("../models/package.js");

module.exports.postReview = async (req, res) => {
  let { id } = req.params;
  let package = await Package.findById(id);

  if (package.owner.equals(req.user._id)) {
    req.flash("error", "You cannot review your own listing!");
    return res.redirect(`/packages/${package._id}`);
  }
  let { review } = req.body;

  let newReview = new Review(review);
  newReview.author = req.user._id;

  package.reviews.push(newReview);
  await newReview.save();
  await package.save();
  // console.log(newReview);
  // console.log(package);

  req.flash("success", "Review added!");

  res.redirect(`/packages/${package._id}`);
};

module.exports.destroyReview = async (req, res) => {
  let { id, reviewId } = req.params;
  // remove the review id (reference) from the listing's reviews array
  await Package.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  // delete the actual review document from Review collection
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Review Deleted!");
  res.redirect(`/packages/${id}`);
};
