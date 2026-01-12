const Listing = require("../models/listing.js");

// 1. index  ->  to show all data.
module.exports.index = async (req, res) => {
  const allListings = await Listing.find({}); //SHOW ALL DATA
  res.render("listings/index.ejs", { allListings }); // PASSED allListing
};

// add new listings
module.exports.renderNewForm = async (req, res) => {
  res.render("listings/new.ejs");
};

// show route - for individual id's
module.exports.showIndividualListings = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");

  if (!listing) {
    req.flash("error", "Listing you requested for does not exist!");
    return res.redirect("/listings");
  }
  res.render("listings/show.ejs", { listing });
};

//Create New Listing form
module.exports.createNewListings = async (req, res) => {
  let url = req.file.path;
  let filename = req.file.filename;

  // console.log(url, "--", filename, "--", req.file);
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };
  await newListing.save();
  req.flash("success", "New Listing Created!");

  res.redirect("/listings");

  // Handle multiple files
  // if (req.file && req.file.length > 0) {
  //   newListing.images = req.file.map((file) => ({
  //     url: file.path,
  //     filename: file.filename,
  //   }));
  // }

  // console.log(newListing);
};

//Render EDIT form
module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", "Listing you requested for doesn't exits");
  }

  let originalImageUrl = listing.image.url;
  originalImageUrl = originalImageUrl.replace(
    "/upload/",
    "/upload/h_150,w_250/"
  );

  // console.log(originalImageUrl);

  res.render("listings/edit.ejs", { listing, originalImageUrl });
};

//Update Listingss
module.exports.updateListings = async (req, res) => {
  if (!req.body.listing) {
    throw new ExpressError(400, "Send Valid Data For Listing");
  }
  let { id } = req.params;

  // first find and update the listing and then to save image put url and filename into the updateListing - save it.
  let updateListing = await Listing.findByIdAndUpdate(id, {
    ...req.body.listing,
  });

  // If we'll not upload any pic while updating -> no pic - no path it will show err.
  // to manage it we will give condition if we have file in req then ->
  if (req.file) {
    let url = req.file.path;
    let filename = req.file.filename;
    updateListing.image = { url, filename };
    await updateListing.save();
  }

  req.flash("success", "listing updated!");
  res.redirect(`/listings/${id}`);
};

// Delete Listings
module.exports.destroyListings = async (req, res) => {
  let { id } = req.params;

  const deleteList = await Listing.findByIdAndDelete(id);
  //   console.log(deleteList);
  req.flash("success", "listing deleted!");
  res.redirect("/listings");
};
