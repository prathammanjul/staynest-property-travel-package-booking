// require express
const express = require("express");
const app = express();

// require mongoose
const mongoose = require("mongoose");
// require listing schema from models

const path = require("path");
//rewuire methodOverride for delete
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

// FOR ERROR HANDLING {

//require ExpressCustom Error
const ExpressError = require("./utils/ExpressError.js");
// }

//require listing routes from lisitng.js
const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");

// Connect to database/ create database
let MONGO_URL = "mongodb://127.0.0.1:27017/stayNest";

main()
  .then(() => {
    console.log("connect to db");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

// start your server
app.listen(8080, () => {
  console.log("server is listening to port 8080");
});

// set up basic API
app.get("/", (req, res) => {
  res.send("Hii , I am root");
});

// for listing routes we are only use this route
app.use("/listings", listings);
// for listing routes we are only use this route
app.use("/listings/:id/reviews", reviews);

app.use((req, res, next) => {
  next(new ExpressError(404, "Page Not Found !"));
});

// middleware for err handling
app.use((err, req, res, next) => {
  const { statusCode = 400, message = "Something went wrong!" } = err;
  res.status(statusCode).render("error.ejs", { err });
});

// app.get("/testListing" , async(req ,res) =>{

//     let sampleListing = new Listing({
//         title : "My New Villa",
//         description : "by the beach",
//         price: 1200,
//         location : "calangute, Goa",
//         country: "India"
//     });

//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("successful testing");
// })
