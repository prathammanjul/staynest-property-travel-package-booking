if (process.env.NODE_ENV != "production") {
  // to access .env file
  require("dotenv").config();
}

// require express
const express = require("express");
const app = express();

// require mongoose
const mongoose = require("mongoose");

const path = require("path");
//rewuire methodOverride for delete
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

// FOR ERROR HANDLING {

//require ExpressCustom Error
const ExpressError = require("./utils/ExpressError.js");
// }
// require express-session to store cookie/connect-flash in browser
const session = require("express-session");
const flash = require("connect-flash");

const {
  isLoggedIn,
  validatePackage,
  validateReview,
  isPackageOwner,
  isNotPackageOwner,
} = require("./middleware.js");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const Package = require("./models/package.js");
const Booking = require("./models/booking.js");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const {
  listingSchema,
  reviewSchema,
  bookingSchema,
  packageSchema,
  BookingSchema,
} = require("./schema.js");
//require routes
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const bookingRouter = require("./routes/booking.js");
const packageRouter = require("./routes/package.js");
const packageBookingRouter = require("./routes/packageBooking.js");
const packageReviewRouter = require("./routes/packageReview.js");

// Connect to database/ create database
// let MONGO_URL = "mongodb://127.0.0.1:27017/stayNest";
const dbUrl = process.env.ATLASDB_URL;

main()
  .then(() => {
    console.log("connect to db");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(dbUrl);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

// start your server
app.listen(8080, "0.0.0.0", () => {
  console.log("server is listening to port 8080");
});

const sessionOptions = {
  secret: "mysupersecretcode",
  resave: false,
  saveUninitialized: true,
  cookies: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  },
};

//use session
app.use(session(sessionOptions));
// use connect-flash (Always use it before routes)
app.use(flash());

//intialize passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  res.locals.currentCategory = req.query.category;
  res.locals.searchText = req.query.search;
  res.locals.currentPath = req.path;
  next();
});

// set up basic API
// app.get("/", (req, res) => {
//   res.send("Hii , I am root");
// });
// to upload files from form - parse the form data using #Multer.
const multer = require("multer");
const { storage } = require("./cloudConfig.js");
const wrapAsync = require("./utils/wrapAsync.js");
const Review = require("./models/review.js");
const { showPackages } = require("./controllers/package.js");
const upload = multer({ storage });

// for listing routes we are only use this route
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);
app.use("/listings", bookingRouter);
app.use("/packages", packageRouter);
app.use("/packages", packageBookingRouter);
app.use("/packages/:id/reviews", packageReviewRouter);

app.get(
  "/about",
  wrapAsync(async (req, res) => {
    res.render("listings/aboutUs");
  }),
);

app.get(
  "/contact",
  wrapAsync(async (req, res) => {
    res.render("listings/contactUs");
  }),
);

// ------------------------------------------
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
