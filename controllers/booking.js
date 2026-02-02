const Booking = require("../models/booking.js");
const Listing = require("../models/listing.js");

//Render booking form (GET)
module.exports.renderBookingForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }

  //send checkin checkout data
  const existingBooking = await Booking.find(
    { listing: id },
    { checkIn: 1, checkOut: 1 },
  );

  res.render("listings/bookingForm.ejs", { listing, existingBooking });
};

//Create booking (POST)
module.exports.createBooking = async (req, res) => {
  const { id } = req.params;
  const { checkIn, checkOut } = req.body.booking;

  //Fetch Listing data to get location , country to insert in Booking database
  const listing = await Listing.findById(id);

  // Convert string dates → Date objects
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  const today = new Date();
  // comparison becomes date-only, not time-based.
  today.setHours(0, 0, 0, 0); // normalize

  //  DOUBLE BOOKING CHECK( Check if there is any existing booking on same date)
  const conflictingBooking = await Booking.findOne({
    listing: id,
    checkIn: { $lt: checkOutDate },
    checkOut: { $gt: checkInDate },
  });
  //Conflict found - NO Booking
  if (conflictingBooking) {
    req.flash(
      "error",
      "This listing is already booked for the selected dates.",
    );
    return res.redirect(`/listings/${id}/booking-page`);
  }
  // 3️ Create booking Object (only after All validation passes)
  const newBooking = new Booking({
    ...req.body.booking,
    location: listing.location,
    country: listing.country,
    user: req.user._id,
    listing: id,
  });

  await newBooking.save();

  req.flash("success", "Booking confirmed!");
  res.redirect(`/listings/${id}`);
};
