// REQUIRE EXPRESS
const express = require("express");
const app = express();

// REQUIRE mongoose
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

//REQUIRE SCHEMA.JS FOR SERVER SIDE VALIDATION USING JOE
const { listingSchema, reviewSchema } = require("./schema.js");
const Review = require("./models/review.js");

// FOR ERROR HANDLING {
//require wrapAsync for err handling
const wrapAsync = require("./utils/wrapAsync.js");

//require ExpressCustom Error
const ExpressError = require("./utils/ExpressError.js");

// }

// CONNECT TO DATABASE / CREATE DATABASE
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

// START YOUR SERVER
app.listen(8080, () => {
  console.log("server is listening to port 8080");
});

// set up basic API
app.get("/", (req, res) => {
  res.send("Hii , I am root");
});

// Create validation middleware for Listings
const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);

  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    // console.log(errMsg);
    // console.log(error.details);
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

// Create validation middleware for reviews

const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);

  if (error) {
    const errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

// 1. INDEX ROUTE -  to show all data.
app.get(
  "/listings",
  wrapAsync(async (req, res) => {
    const allListings = await Listing.find({}); //SHOW ALL DATA
    res.render("listings/index.ejs", { allListings }); // PASSED allListing
  })
);

// ADD NEW LISTING
app.get("/listings/new", (req, res) => {
  res.render("listings/new.ejs");
});

// SHOW ROUTE  - FOR INDIVIDUAL ID'S
app.get(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs", { listing });
  })
);

//  CREATE ROUTE
app.post(
  "/listings",
  validateListing,
  wrapAsync(async (req, res, next) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
    // console.log(newListing);
  })
);

//EDIT ROUTE
app.get(
  "/listings/:id/edit",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
  })
);

//UPDATE ROUTE
app.put(
  "/listings/:id",
  validateListing,
  wrapAsync(async (req, res) => {
    if (!req.body.listing) {
      throw new ExpressError(400, "Send Valid Data For Listing");
    }
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect("/listings");
  })
);

//DELETE ROUTE
app.delete(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const deleteList = await Listing.findByIdAndDelete(id);
    //   console.log(deleteList);
    res.redirect("/listings");
  })
);

// REVIEWS
//Post route
app.post(
  "/listings/:id/reviews",
  validateReview,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    let { review } = req.body;
    let newReview = new Review(review);

    // here we are accessing our reviews array from listing schema.
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    // console.log("new reviewed saved");
    // res.send("new reviewed saved");

    res.redirect(`/listings/${listing._id}`);
  })
);

//Delete review route

app.delete(
  "/listings/:id/reviews/:reviewId",
  wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
  })
);

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
