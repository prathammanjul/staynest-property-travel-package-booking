const { isLoggedIn } = require("../middleware.js");
const User = require("../models/user.js");

// signup page
module.exports.renderSignUpform = (req, res) => {
  res.render("users/signup.ejs");
};

// Signup
module.exports.signUp = async (req, res) => {
  try {
    let { username, email, password } = req.body;
    const newUser = new User({ email, username });
    const registeredUser = await User.register(newUser, password);
    // console.log(registeredUser);
    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      } else {
        req.flash("success", "Welcome to stayNest");
        res.redirect("/listings");
      }
    });
  } catch (error) {
    req.flash("error", error.message);
    return res.redirect("/signup");
  }
};

// login form
module.exports.renderLoginform = (req, res) => {
  res.render("users/login.ejs");
};

// login status
module.exports.loginStatus = async (req, res) => {
  req.flash("success", "Welcome to stayNest");
  let directUrl = res.locals.redirectUrl || "/listings";
  res.redirect(directUrl);
};

// Logout status
module.exports.logout = (req, res, next) => {
  req.logOut((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "Logged you out!");
    res.redirect("/listings");
  });
};
