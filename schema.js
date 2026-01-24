const Joi = require("joi");
module.exports.listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required().label("description"),
    location: Joi.string().required(),
    country: Joi.string().required(),
    price: Joi.number().required().min(0),
    image: Joi.string().allow("", null),
  }).required(),
});

module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().required().min(1).max(5),
    comment: Joi.string().required(),
    // createdAt: Joi.date,
  }).required(),
});

module.exports.bookingSchema = Joi.object({
  booking: Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().required(),
    contact: Joi.number().required(),
    // location: Joi.string(),
    // country: Joi.string(),
    // duration: Joi.number(),
    checkIn: Joi.number().required(),
    checkOut: Joi.number().required(),
    guests: Joi.number().required(),
    emergencyContactName: Joi.string(),
    emergencyNumber: Joi.number(),
    specialRequest: Joi.string(),
  }).required(),
});
