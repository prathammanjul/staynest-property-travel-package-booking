const Booking = require("../models/booking.js");
const Package = require("../models/package.js");

// render package booking page
module.exports.renderPackageBookingForm = async (req, res) => {
  const { id } = req.params;
  const package = await Package.findById(id);
  //send checkin checkout data
  const existingBooking = await Booking.find(
    { package: id },
    { checkIn: 1, checkOut: 1 },
  );
  res.render("listings/packageBookingForm", { package, existingBooking });
};

module.exports.createPackageBooking = async (req, res) => {
  const { id } = req.params;
  const { checkIn, checkOut } = req.body.booking;

  //Fetch Listing data to get location , country to insert in Booking database
  const package = await Package.findById(id);

  // Convert string dates → Date objects
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  const today = new Date();
  // comparison becomes date-only, not time-based.
  today.setHours(0, 0, 0, 0); // normalize

  //  DOUBLE BOOKING CHECK( Check if there is any existing booking on same date)
  const conflictingBooking = await Booking.findOne({
    package: id,
    checkIn: { $lt: checkOutDate },
    checkOut: { $gt: checkInDate },
  });
  //Conflict found - NO Booking
  if (conflictingBooking) {
    req.flash(
      "error",
      "This listing is already booked for the selected dates.",
    );
    return res.redirect(`/packages/${id}/packageBookingForm`);
  }
  // 3️ Create booking Object (only after All validation passes)
  const newBooking = new Booking({
    ...req.body.booking,
    location: package.location,
    country: package.country,
    user: req.user._id,
    package: id,
  });

  await newBooking.save();

  req.flash("success", "Booking confirmed!");
  res.redirect(`/packages/${id}`);
};
