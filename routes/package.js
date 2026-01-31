const express = require("express");
const router = express.Router();
//require wrapAsync for err handling
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const Booking = require("../models/booking.js");
const Package = require("../models/package.js");
const {
  isLoggedIn,
  validatePackage,
  isPackageOwner,
} = require("../middleware.js");
const packageController = require("../controllers/package.js");

// to upload files from form - parse the form data using #Multer.
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

router
  .route("/")
  .get(wrapAsync(packageController.showAllPackages)) // Render  package listing page
  .post(
    // create package (Submit form)
    upload.single("package[image]"),
    isLoggedIn,
    validatePackage,
    wrapAsync(packageController.createNewPackage),
  );

// render package form
router.get(
  "/new",
  isLoggedIn,
  validatePackage,
  wrapAsync(packageController.renderNewPackageForm),
);

// show package details
router
  .route("/:id")
  .get(wrapAsync(packageController.showPackages))
  .put(
    upload.single("package[image]"),
    isLoggedIn,
    isPackageOwner,
    validatePackage,
    wrapAsync(packageController.updatePackage),
  )
  .delete(
    isLoggedIn,
    isPackageOwner,
    wrapAsync(packageController.destroyPackage),
  );

// post add package

//edit package
router.get(
  "/:id/edit",
  isLoggedIn,
  isPackageOwner,
  wrapAsync(packageController.renderEditForm),
);

module.exports = router;
