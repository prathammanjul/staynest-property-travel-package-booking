const { isPackageOwner } = require("../middleware.js");
const Package = require("../models/package.js");

module.exports.showAllPackages = async (req, res) => {
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
};

module.exports.renderNewPackageForm = async (req, res) => {
  res.render("listings/newPackage");
};

module.exports.showPackages = async (req, res) => {
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
};

module.exports.createNewPackage = async (req, res) => {
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
};

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const package = await Package.findById(id);

  res.render("listings/editPackage", { package, isPackageOwner });
};

module.exports.updatePackage = async (req, res) => {
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
};

module.exports.destroyPackage = async (req, res) => {
  let { id } = req.params;
  let package = await Package.findByIdAndDelete(id);
  req.flash("success", "Package deleted");
  res.redirect("/packages");
};
