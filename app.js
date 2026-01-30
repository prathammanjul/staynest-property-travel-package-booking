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
  isOwner,
  validateReview,
  isPackageOwner,
  saveRedirectUrl,
} = require("./middleware.js");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const Package = require("./models/package.js");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const {
  listingSchema,
  reviewSchema,
  bookingSchema,
  packageSchema,
} = require("./schema.js");
//require routes
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const bookingRouter = require("./routes/booking.js");

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
const upload = multer({ storage });

// for listing routes we are only use this route
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);
app.use("/listings", bookingRouter);

// ---------------------------------------------
// Render  package listing page
app.get(
  "/packages",
  wrapAsync(async (req, res) => {
    const { category, search } = req.query;

    let Packagefilter = {};

    if (category) {
      Packagefilter.categories = category;
    }
    if (search) {
      Packagefilter.$or = [
        { title: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
        { country: { $regex: search, $options: "i" } },
        { categories: { $regex: search, $options: "i" } },
      ];
    }

    const allPackages = await Package.find(Packagefilter);

    res.render("listings/package", { allPackages, currentCategory: category });
  }),
);

// render package form
app.get(
  "/packages/new",
  isLoggedIn,
  validatePackage,
  wrapAsync(async (req, res) => {
    res.render("listings/newPackage");
  }),
);

// post add package
app.post(
  "/packages",
  upload.single("package[image]"),
  isLoggedIn,
  validatePackage,

  wrapAsync(async (req, res) => {
    const newPackage = new Package(req.body.package);
    newPackage.owner = req.user._id;

    let url = req.file.path;
    let filename = req.file.filename;
    newPackage.image = { url, filename };

    newPackage.include = req.body.package.include
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item.length > 0);

    newPackage.itinerary = req.body.itinerary.map((item, index) => ({
      day: index + 1,
      title: item.title,
      description: item.description,
    }));

    await newPackage.save();
    req.flash("success", "New Listing Created!");

    res.redirect("/packages");
  }),
);

// show package details
app.get(
  "/packages/:id",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const package = await Package.findById(id)
      .populate({
        path: "reviews",
        populate: {
          path: "author",
        },
      })
      .populate("owner");

    res.render("listings/showPackage", { package });
  }),
);

//edit package
app.get(
  "/packages/:id/edit",
  isLoggedIn,
  isPackageOwner,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const package = await Package.findById(id);

    res.render("listings/editPackage", { package, isOwner });
  }),
);

app.put(
  "/packages/:id",
  upload.single("package[image]"),
  isLoggedIn,
  isPackageOwner,
  validatePackage,
  wrapAsync(async (req, res) => {
    if (!req.body.package) {
      throw new ExpressError(400, "Send Valid Data For package");
    }

    const { id } = req.params;

    let updatePackage = await Package.findByIdAndUpdate(
      id,
      { ...req.body.package },
      { new: true },
    );

    let includes = req.body.package.include;

    if (Array.isArray(includes)) {
      updatePackage.include = includes;
    } else {
      updatePackage.include = includes
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item.length > 0);
    }

    updatePackage.itinerary = req.body.itinerary.map((item, index) => ({
      day: index + 1,
      title: item.title,
      description: item.description,
    }));

    if (req.file) {
      updatePackage.image = {
        url: req.file.path,
        filename: req.file.filename,
      };
    }

    await updatePackage.save();

    req.flash("success", "Package updated!");
    res.redirect(`/packages/${id}`);
  }),
);

// DELETE PACKAGE
app.delete(
  "/packages/:id",
  isLoggedIn,
  isPackageOwner,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let package = await Package.findByIdAndDelete(id);
    req.flash("success", "Package deleted");
    res.redirect("/packages");
  }),
);

// reviews
app.post(
  "/packages/:id/reviews",
  isLoggedIn,
  validateReview,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let package = await Package.findById(id);
    let { review } = req.body;

    let newReview = new Review(review);
    newReview.author = req.user._id;

    package.reviews.push(newReview);
    await newReview.save();
    await package.save();
    console.log(newReview);
    console.log(package);

    req.flash("success", "Review added!");

    res.redirect(`/packages/${package._id}`);
  }),
);

app.delete(
  "/packages/:id/reviews/:reviewId",
  wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    // remove the review id (reference) from the listing's reviews array
    await Package.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    // delete the actual review document from Review collection
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted!");
    res.redirect(`/packages/${id}`);
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
