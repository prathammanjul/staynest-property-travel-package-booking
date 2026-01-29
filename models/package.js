const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const itinerarySchema = new Schema({
  day: {
    type: Number,
  },
  title: {
    type: String,
  },
  description: {
    type: String,
  },
});

const packageSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  groupSize: {
    type: Number,
    required: true,
  },
  bestTime: {
    type: String,
    required: true,
  },
  totalActivities: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  image: {
    url: String,
    filename: String,
  },
  location: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  category: {
    type: String,
  },
  include: {
    type: [String],
    required: true,
  },
  // rating: {
  //   type: Number,
  // },

  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },

  itinerary: [itinerarySchema],
});

module.exports = mongoose.model("Package", packageSchema);
