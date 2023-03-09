const { subject } = require("@casl/ability");
const { policyFor } = require("../../utils/index");
const Address = require("./model");

const index = async (req, res, next) => {
  try {
    const { skip = 0, limit = 10 } = req.query;
    const count = await Address.countDocuments();
    const address = await Address.find().skip(parseInt(skip)).limit(parseInt(limit));
    res.json({
      data: address,
      count,
    });
  } catch (err) {
    next(err);
  }
};

const view = async (req, res, next) => {
  try {
    const { id } = req.params;
    const address = await Address.findById(id);
    res.json(address);
  } catch (err) {
    next(err);
  }
};

const store = async (req, res, next) => {
  try {
    const payload = req.body;
    const user = req.user;
    const address = new Address({ ...payload, user: user._id });
    await address.save();
    return res.json(address);
  } catch (err) {
    if (err && err.name === "ValidationError") {
      res.json({
        error: 1,
        message: err.message,
        fields: err.errors,
      });
    }
    next(err);
  }
};

// untuk middleware otorisasi update dekivery addres, middleware otorisasi nya digunakan di controler bukan di routes
const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    let { _id, ...payload } = req.body;
    let address = await Address.findById(id);
    let subjectAddress = subject("DeliveryAddress", { ...address, user_id: address.user });
    let policy = policyFor(req.user);
    if (!policy.can("update", subjectAddress)) {
      return res.json({
        error: 1,
        message: "You're not allowed to modify this resource",
      });
    }

    address = await Address.findByIdAndUpdate(id, payload, { new: true });
    res.json(address);
  } catch (err) {
    if (err && err.name === "ValidationError") {
      res.json({
        error: 1,
        message: err.message,
        fields: err.errors,
      });
    }
    next(err);
  }
};

// untuk middleware otorisasi delete dekivery addres, middleware otorisasi nya digunakan di controler bukan di routes
const destroy = async (req, res, next) => {
  try {
    const { id } = req.params;
    let address = await Address.findById(id);
    const subjectAddress = subject("DeliveryAddress", { ...address, user_id: address.user });
    let policy = policyFor(req.user);
    if (!policy.can("delete", subjectAddress)) {
      return res.json({
        error: 1,
        message: "You're not allowed to modify this resource",
      });
    }
    address = await Address.findByIdAndDelete(id);
    res.json({ message: "delete succesfully", address });
  } catch (err) {
    if (err && err.name === "ValidationError") {
      return res.json({
        error: 1,
        message: err.message,
        fields: err.errors,
      });
    }
    next(err);
  }
};

module.exports = { store, index, view, update, destroy };
