const Joi = require("joi");
module.exports.listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required().label("description"),
    location: Joi.string().required(),
    country: Joi.string().required(),
    price: Joi.number().required().min(0),
    categories: Joi.string().required(),
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
    // categories: Joi.string().required(),
    checkIn: Joi.date().required(),
    checkOut: Joi.date().required(),
    guests: Joi.number().required(),
    // location: Joi.string().required(),
    // country: Joi.string().required(),
    // duration: Joi.number().required(),
    emergencyContactName: Joi.string().allow(""),
    emergencyNumber: Joi.number().allow(""),
    specialRequest: Joi.string().allow(""),
  }).required(),
});

module.exports.packageSchema = Joi.object({
  package: Joi.object({
    title: Joi.string().required(),

    description: Joi.string().required(),

    duration: Joi.number().min(1).required(),

    groupSize: Joi.number().min(1).required(),

    bestTime: Joi.string().required(),

    totalActivities: Joi.number().min(1).required(),

    price: Joi.number().min(0).required(),

    location: Joi.string().required(),

    country: Joi.string().required(),

    categories: Joi.string().required(),

    include: Joi.string()
      .required()
      .custom((value, helpers) => {
        const items = value
          .split(",")
          .map((item) => item.trim())
          .filter((item) => item.length > 0);

        if (items.length < 4) {
          return helpers.error("any.custom");
        }

        return value;
      })
      .messages({
        "any.custom": "Include field : at least 4 items separated by commas",
        "string.empty": "Include field cannot be empty",
      }),

    rating: Joi.number(),
  }).required(),

  itinerary: Joi.array()
    .items(
      Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
      }),
    )
    .min(2)
    .required()
    .messages({
      "array.min": "Itinerary must have at least 2 days",
      "array.base": "Itinerary must be a list of days",
    }),
});
