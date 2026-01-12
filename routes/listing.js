const express = require("express");
const router = express.Router();
//require wrapAsync for err handling
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js");

// to upload files from form - parse the form data using #Multer.
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

// 1. index route -  to show all data.
// 2. create new Listing
router
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(
    isLoggedIn,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.createNewListings)
  );

// render New listings form
router.get("/new", isLoggedIn, listingController.renderNewForm);

// 3. show route - for individual id's
// 4. UPDATE
// 5. Destroy Listing
router
  .route("/:id")
  .get(wrapAsync(listingController.showIndividualListings))
  .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.updateListings)
  )
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListings));

//EDIT ROUTE
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm)
);

module.exports = router;
