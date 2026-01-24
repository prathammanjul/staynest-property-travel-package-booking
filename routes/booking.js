const express = require("express");
const router = express.Router();

//require wrapAsync for err handling
const wrapAsync = require("../utils/wrapAsync.js");

const { isLoggedIn, isNotOwner, validateBooking } = require("../middleware.js");
const bookingController = require("../controllers/booking.js");

router.get(
  "/:id/booking-page",
  isLoggedIn,
  isNotOwner,
  wrapAsync(bookingController.renderBookingForm),
);

router.post(
  "/:id/bookings",
  isLoggedIn,
  isNotOwner,
  validateBooking,
  wrapAsync(bookingController.createBooking),
);

module.exports = router;
