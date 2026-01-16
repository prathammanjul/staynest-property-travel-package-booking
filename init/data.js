const mongoose = require("mongoose");
const Listing = require("../models/listing");

const sampleListings = [
  {
    title: "Cozy Beachfront Cottage",
    description:
      "Escape to this charming beachfront cottage for a relaxing getaway.",
    image: {
      filename: "beach1",
      url: "https://plus.unsplash.com/premium_photo-1661963657305-f52dcaeef418?w=900&auto=format&fit=crop&q=60",
    },
    price: 1500,
    location: "Malibu",
    country: "United States",
    geometry: { type: "Point", coordinates: [-118.7798, 34.0259] },
    categories: "Trending",
  },

  {
    title: "Modern Loft in Downtown",
    description:
      "Stay in the heart of the city in this stylish loft apartment.",
    image: {
      filename: "nyc1",
      url: "https://plus.unsplash.com/premium_photo-1689609950112-d66095626efb?w=900&auto=format&fit=crop&q=60",
    },
    price: 1200,
    location: "New York City",
    country: "United States",
    geometry: { type: "Point", coordinates: [-74.006, 40.7128] },
    categories: "Iconic cities",
  },

  {
    title: "Mountain Retreat",
    description: "Unplug and unwind in this peaceful mountain cabin.",
    image: {
      filename: "mountain1",
      url: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=900&auto=format&fit=crop&q=60",
    },
    price: 1000,
    location: "Aspen",
    country: "United States",
    geometry: { type: "Point", coordinates: [-106.8231, 39.1911] },
    categories: "Mountains",
  },

  {
    title: "Historic Villa in Tuscany",
    description:
      "Experience the charm of Tuscany in this beautifully restored villa.",
    image: {
      filename: "italy1",
      url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=900&auto=format&fit=crop&q=60",
    },
    price: 2500,
    location: "Florence",
    country: "Italy",
    geometry: { type: "Point", coordinates: [11.2558, 43.7696] },
    categories: "Castles",
  },

  {
    title: "Private Island Retreat",
    description: "Have an entire island to yourself.",
    image: {
      filename: "island1",
      url: "https://plus.unsplash.com/premium_photo-1661915661139-5b6a4e4a6fcc?w=900&auto=format&fit=crop&q=60",
    },
    price: 10000,
    location: "Fiji",
    country: "Fiji",
    geometry: { type: "Point", coordinates: [178.065, -17.7134] },
    categories: "Amazing pools",
  },

  {
    title: "Historic Canal House",
    description: "Stay in a piece of history in Amsterdam.",
    image: {
      filename: "amsterdam1",
      url: "https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?w=900&auto=format&fit=crop&q=60",
    },
    price: 1800,
    location: "Amsterdam",
    country: "Netherlands",
    geometry: { type: "Point", coordinates: [4.9041, 52.3676] },
    categories: "Iconic cities",
  },

  {
    title: "Beachfront Bungalow in Bali",
    description: "Relax on the sandy shores of Bali.",
    image: {
      filename: "bali1",
      url: "https://images.unsplash.com/photo-1598228723793-52759bba239c?w=900&auto=format&fit=crop&q=60",
    },
    price: 1800,
    location: "Bali",
    country: "Indonesia",
    geometry: { type: "Point", coordinates: [115.1889, -8.4095] },
    categories: "Trending",
  },

  {
    title: "Modern Apartment in Tokyo",
    description: "Explore Tokyo from this modern apartment.",
    image: {
      filename: "tokyo1",
      url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=900&auto=format&fit=crop&q=60",
    },
    price: 2000,
    location: "Tokyo",
    country: "Japan",
    geometry: { type: "Point", coordinates: [139.6503, 35.6762] },
    categories: "Iconic cities",
  },

  {
    title: "Luxury Villa in the Maldives",
    description: "Indulge in luxury over the ocean.",
    image: {
      filename: "maldives1",
      url: "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=900&auto=format&fit=crop&q=60",
    },
    price: 6000,
    location: "Maldives",
    country: "Maldives",
    geometry: { type: "Point", coordinates: [73.2207, 3.2028] },
    categories: "Amazing pools",
  },

  {
    title: "Desert Oasis in Dubai",
    description: "Luxury in the middle of the desert.",
    image: {
      filename: "dubai1",
      url: "https://images.unsplash.com/photo-1576941089067-2de3c901e126?w=900&auto=format&fit=crop&q=60",
    },
    price: 5000,
    location: "Dubai",
    country: "United Arab Emirates",
    geometry: { type: "Point", coordinates: [55.2708, 25.2048] },
    categories: "Trending",
  },
];

// async function seedDB() {
//   await mongoose.connect("mongodb://127.0.0.1:27017/stayNest");

//   await Listing.deleteMany({});
//   initData.data = initData.data.map((obj) => ({
//     ...obj,
//     owner: "6960ffb211c988d8b0fdff16",
//   }));
//   await Listing.insertMany(sampleListings);

//   console.log("Database seeded");
//   mongoose.connection.close();
// }

// seedDB();
module.exports = { data: sampleListings };
