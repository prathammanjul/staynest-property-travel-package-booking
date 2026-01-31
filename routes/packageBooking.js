const express = require("express");
const router = express.Router();

//require wrapAsync for err handling
const wrapAsync = require("../utils/wrapAsync.js");

const {
  isLoggedIn,

  validatePackage,
  isNotPackageOwner,
  validateBooking,
} = require("../middleware.js");

const packageBookingController = require("../controllers/packageBooking.js");

router.get(
  "/:id/packageBookingForm",
  isLoggedIn,
  isNotPackageOwner,
  wrapAsync(packageBookingController.renderPackageBookingForm),
);

router.post(
  "/:id/packageBookingForm",
  isLoggedIn,
  validateBooking,
  wrapAsync(packageBookingController.createPackageBooking),
);

module.exports = router;
