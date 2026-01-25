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
  },
  description: {
    type: String,
  },
  duration: {
    type: String,
  },
  groupSize: {
    type: String,
  },
  bestTime: {
    type: String,
  },
  totalActivities: {
    type: String,
  },
  price: {
    type: Number,
    required: true,
  },
  location: {
    type: String,
  },
  country: {
    type: String,
  },
  category: {
    type: String,
  },
  include: {
    type: [String],
  },
  rating: {
    type: Number,
  },
  image: {
    url: String,
    filename: String,
  },
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
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("Package", packageSchema);
