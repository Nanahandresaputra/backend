const Categories = require("./model");

// categories
const index = async (req, res, next) => {
  try {
    const category = await Categories.find();
    return res.json(category);
  } catch (e) {
    next(e);
  }
};

// add categories
const store = async (req, res, next) => {
  try {
    const payload = req.body;
    const category = new Categories(payload);
    await category.save();
    return res.json(category);
  } catch (err) {
    if (err && err.name === "ValidationError") {
      res.json({
        err: 1,
        message: err.message,
        field: err.errors,
      });
    }
    next(err);
  }
};

// view category
const view = async (req, res, next) => {
  try {
    const { id } = req.params;
    const category = await Categories.findById(id);
    return res.json(category);
  } catch (err) {
    next(err);
  }
};

// delete categories
const destroy = async (req, res, next) => {
  try {
    const { id } = req.params;
    const categories = await Categories.findByIdAndDelete(id);
    return res.json(categories);
  } catch (e) {
    next(e);
  }
};

// update categories
const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const payload = req.body;
    const category = await Categories.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true,
    });
    res.json(category);
  } catch (err) {
    if (err && err.name === "ValidationError") {
      res.json({
        error: 1,
        message: err.message,
        field: err.errors,
      });
    }
    next(err);
  }
};
module.exports = { index, store, view, destroy, update };
