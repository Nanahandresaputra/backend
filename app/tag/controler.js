const Tag = require("./model");

// tag index
const index = async (req, res, next) => {
  try {
    const tag = await Tag.find();
    return res.json(tag);
  } catch (e) {
    next(e);
  }
};

// tag view
const view = async (req, res, next) => {
  try {
    const { id } = req.params;
    const tag = await Tag.findById(id);
    res.json(tag);
  } catch (err) {
    next(err);
  }
};

// tag add
const store = async (req, res, next) => {
  try {
    const payload = req.body;
    const tag = new Tag(payload);
    await tag.save();
    res.json(tag);
  } catch (err) {
    if (err && err.name === "ValdatiorError") {
      res.json({
        error: 1,
        message: err.message,
        field: err.errors,
      });
    }
  }
};

// tag update
const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const payload = req.body;
    const tag = await Tag.findByIdAndUpdate(id, payload);
    tag.save();
    return res.json(tag);
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

// tag destroy
const destroy = async (req, res, next) => {
  try {
    const { id } = req.params;
    const tag = await Tag.findByIdAndDelete(id);
    res.json(tag);
  } catch (err) {
    next(err);
  }
};

module.exports = { index, store, update, view, destroy };
