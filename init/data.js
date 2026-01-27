const mongoose = require("mongoose");
// const Listing = require("../models/listing");
const Package = require("../models/package");

// const sampleListings = [
//   {
//     title: "Cozy Beachfront Cottage",
//     description:
//       "Escape to this charming beachfront cottage for a relaxing getaway.",
//     image: {
//       filename: "beach1",
//       url: "https://plus.unsplash.com/premium_photo-1661963657305-f52dcaeef418?w=900&auto=format&fit=crop&q=60",
//     },
//     price: 1500,
//     location: "Malibu",
//     country: "United States",
//     geometry: { type: "Point", coordinates: [-118.7798, 34.0259] },
//     categories: "Trending",
//   },

//   {
//     title: "Modern Loft in Downtown",
//     description:
//       "Stay in the heart of the city in this stylish loft apartment.",
//     image: {
//       filename: "nyc1",
//       url: "https://plus.unsplash.com/premium_photo-1689609950112-d66095626efb?w=900&auto=format&fit=crop&q=60",
//     },
//     price: 1200,
//     location: "New York City",
//     country: "United States",
//     geometry: { type: "Point", coordinates: [-74.006, 40.7128] },
//     categories: "Iconic cities",
//   },

//   {
//     title: "Mountain Retreat",
//     description: "Unplug and unwind in this peaceful mountain cabin.",
//     image: {
//       filename: "mountain1",
//       url: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=900&auto=format&fit=crop&q=60",
//     },
//     price: 1000,
//     location: "Aspen",
//     country: "United States",
//     geometry: { type: "Point", coordinates: [-106.8231, 39.1911] },
//     categories: "Mountains",
//   },

//   {
//     title: "Historic Villa in Tuscany",
//     description:
//       "Experience the charm of Tuscany in this beautifully restored villa.",
//     image: {
//       filename: "italy1",
//       url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=900&auto=format&fit=crop&q=60",
//     },
//     price: 2500,
//     location: "Florence",
//     country: "Italy",
//     geometry: { type: "Point", coordinates: [11.2558, 43.7696] },
//     categories: "Castles",
//   },

//   {
//     title: "Private Island Retreat",
//     description: "Have an entire island to yourself.",
//     image: {
//       filename: "island1",
//       url: "https://plus.unsplash.com/premium_photo-1661915661139-5b6a4e4a6fcc?w=900&auto=format&fit=crop&q=60",
//     },
//     price: 10000,
//     location: "Fiji",
//     country: "Fiji",
//     geometry: { type: "Point", coordinates: [178.065, -17.7134] },
//     categories: "Amazing pools",
//   },

//   {
//     title: "Historic Canal House",
//     description: "Stay in a piece of history in Amsterdam.",
//     image: {
//       filename: "amsterdam1",
//       url: "https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?w=900&auto=format&fit=crop&q=60",
//     },
//     price: 1800,
//     location: "Amsterdam",
//     country: "Netherlands",
//     geometry: { type: "Point", coordinates: [4.9041, 52.3676] },
//     categories: "Iconic cities",
//   },

//   {
//     title: "Beachfront Bungalow in Bali",
//     description: "Relax on the sandy shores of Bali.",
//     image: {
//       filename: "bali1",
//       url: "https://images.unsplash.com/photo-1598228723793-52759bba239c?w=900&auto=format&fit=crop&q=60",
//     },
//     price: 1800,
//     location: "Bali",
//     country: "Indonesia",
//     geometry: { type: "Point", coordinates: [115.1889, -8.4095] },
//     categories: "Trending",
//   },

//   {
//     title: "Modern Apartment in Tokyo",
//     description: "Explore Tokyo from this modern apartment.",
//     image: {
//       filename: "tokyo1",
//       url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=900&auto=format&fit=crop&q=60",
//     },
//     price: 2000,
//     location: "Tokyo",
//     country: "Japan",
//     geometry: { type: "Point", coordinates: [139.6503, 35.6762] },
//     categories: "Iconic cities",
//   },

//   {
//     title: "Luxury Villa in the Maldives",
//     description: "Indulge in luxury over the ocean.",
//     image: {
//       filename: "maldives1",
//       url: "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=900&auto=format&fit=crop&q=60",
//     },
//     price: 6000,
//     location: "Maldives",
//     country: "Maldives",
//     geometry: { type: "Point", coordinates: [73.2207, 3.2028] },
//     categories: "Amazing pools",
//   },

//   {
//     title: "Desert Oasis in Dubai",
//     description: "Luxury in the middle of the desert.",
//     image: {
//       filename: "dubai1",
//       url: "https://images.unsplash.com/photo-1576941089067-2de3c901e126?w=900&auto=format&fit=crop&q=60",
//     },
//     price: 5000,
//     location: "Dubai",
//     country: "United Arab Emirates",
//     geometry: { type: "Point", coordinates: [55.2708, 25.2048] },
//     categories: "Trending",
//   },
// ];

const samplePackages = [
  {
    title: "Swiss Alps",
    description:
      "Experience breathtaking mountain peaks and pristine alpine landscapes with world-class skiing and hiking trails. The Swiss Alps offer an unparalleled adventure through some of Europe's most stunning natural scenery.",
    duration: 7,
    groupSize: 12,
    bestTime: "June - September",
    totalActivities: 4,
    price: 516441,
    location: "Zurich, Interlaken & Zermatt",
    country: "Switzerland",
    category: "Mountains",
    rating: 4.9,
    include: [
      "7 nights accommodation in luxury alpine lodge",
      "All meals and refreshments",
      "Skiing equipment rental",
      "Travel insurance",
      "Professional mountain guide",
      "Cable car tickets",
      "Airport transfers",
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrival in Zurich",
        description: "Transfer to alpine resort, welcome dinner",
      },
      {
        day: 2,
        title: "Jungfraujoch Excursion",
        description: "Visit the 'Top of Europe' by cogwheel train",
      },
      {
        day: 3,
        title: "Hiking Adventure",
        description: "Guided hike through pristine mountain trails",
      },
      {
        day: 4,
        title: "Alpine Villages Tour",
        description: "Explore traditional Swiss villages",
      },
      {
        day: 5,
        title: "Skiing/Snowboarding",
        description: "Full day on the slopes with instruction",
      },
      {
        day: 6,
        title: "Matterhorn Visit",
        description: "Day trip to iconic Matterhorn peak",
      },
      {
        day: 7,
        title: "Departure",
        description: "Transfer to airport for departure",
      },
    ],
  },

  {
    title: "Himalayan Escape",
    description:
      "Discover the majestic Himalayas with serene valleys, ancient monasteries, and thrilling mountain adventures.",
    duration: 6,
    groupSize: 10,
    bestTime: "April - October",
    totalActivities: 4,
    price: 124999,
    location: "Manali & Solang Valley",
    country: "India",
    category: "Mountains",
    rating: 4.5,
    include: [
      "6 nights hotel stay",
      "Daily breakfast & dinner",
      "Mountain trekking",
      "Local sightseeing",
      "Adventure sports",
      "Airport transfers",
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrival in Manali",
        description: "Hotel check-in and leisure time",
      },
      {
        day: 2,
        title: "Solang Valley",
        description: "Adventure sports and sightseeing",
      },
      { day: 3, title: "Himalayan Trek", description: "Guided mountain trek" },
      {
        day: 4,
        title: "Monastery Visit",
        description: "Explore ancient monasteries",
      },
      {
        day: 5,
        title: "Local Markets",
        description: "Shopping and cultural walk",
      },
      { day: 6, title: "Departure", description: "Return journey" },
    ],
  },

  {
    title: "Rocky Mountains Explorer",
    description:
      "Explore rugged landscapes, alpine lakes, and breathtaking peaks across the iconic Rocky Mountains.",
    duration: 5,
    groupSize: 8,
    bestTime: "May - September",
    totalActivities: 3,
    price: 289000,
    location: "Banff & Lake Louise",
    country: "Canada",
    category: "Mountains",
    rating: 4.6,
    include: [
      "Mountain lodge stay",
      "Guided hikes",
      "Lake tours",
      "All transportation",
      "Park entry tickets",
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrival in Banff",
        description: "Welcome and orientation",
      },
      { day: 2, title: "Lake Louise", description: "Scenic lake exploration" },
      { day: 3, title: "Mountain Hiking", description: "Full-day guided hike" },
      { day: 4, title: "Wildlife Tour", description: "Explore national parks" },
      { day: 5, title: "Departure", description: "Check-out and transfer" },
    ],
  },

  {
    title: "Patagonia Adventure",
    description:
      "Journey through dramatic landscapes, glaciers, and mountain ranges at the edge of the world.",
    duration: 8,
    groupSize: 12,
    bestTime: "October - March",
    totalActivities: 5,
    price: 475000,
    location: "El Calafate & Torres del Paine",
    country: "Argentina",
    category: "Mountains",
    rating: 4.4,
    include: [
      "Eco-lodge stay",
      "Guided treks",
      "Glacier walks",
      "All transport",
      "Park fees",
    ],
    itinerary: [
      { day: 1, title: "Arrival", description: "Transfer to lodge" },
      { day: 2, title: "Glacier Walk", description: "Explore Perito Moreno" },
      { day: 3, title: "Mountain Trek", description: "Torres del Paine hike" },
      { day: 4, title: "Lakes Tour", description: "Scenic boat ride" },
      { day: 5, title: "Wildlife Day", description: "Nature spotting" },
      { day: 6, title: "Cultural Visit", description: "Local villages" },
      { day: 7, title: "Leisure Day", description: "Relaxation" },
      { day: 8, title: "Departure", description: "Return journey" },
    ],
  },

  {
    title: "Dolomites Escape",
    description:
      "A perfect blend of Italian culture and dramatic alpine scenery.",
    duration: 6,
    groupSize: 10,
    bestTime: "June - September",
    totalActivities: 4,
    price: 310000,
    location: "Cortina d’Ampezzo",
    country: "Italy",
    category: "Mountains",
    rating: 4.2,
    include: [
      "Hotel stay",
      "Mountain hikes",
      "Cable car access",
      "Local cuisine experiences",
    ],
    itinerary: [
      { day: 1, title: "Arrival", description: "Hotel check-in" },
      { day: 2, title: "Dolomite Peaks", description: "Cable car excursion" },
      { day: 3, title: "Mountain Trails", description: "Guided hike" },
      { day: 4, title: "Village Tour", description: "Explore alpine towns" },
      { day: 5, title: "Free Day", description: "Optional activities" },
      { day: 6, title: "Departure", description: "Return journey" },
    ],
  },

  {
    title: "Andes Highlands",
    description: "Explore ancient civilizations and towering Andean peaks.",
    duration: 7,
    groupSize: 12,
    bestTime: "May - September",
    totalActivities: 4,
    price: 350000,
    location: "Cusco & Sacred Valley",
    country: "Peru",
    category: "Mountains",
    rating: 4.6,
    include: ["Hotel stay", "Guided tours", "Machu Picchu entry", "Transport"],
    itinerary: [
      { day: 1, title: "Arrival", description: "Acclimatization" },
      { day: 2, title: "Sacred Valley", description: "Cultural exploration" },
      { day: 3, title: "Machu Picchu", description: "Historic site visit" },
      { day: 4, title: "Mountain Hike", description: "Andes trails" },
      { day: 5, title: "Local Markets", description: "Shopping" },
      { day: 6, title: "Leisure", description: "Free day" },
      { day: 7, title: "Departure", description: "Return journey" },
    ],
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

module.exports = { data: samplePackages };
