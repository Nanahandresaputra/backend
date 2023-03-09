const Invoice = require("./model");
const { policyFor } = require("../../utils/index");
const { subject } = require("@casl/ability");

const show = async (req, res, next) => {
  try {
    let { order_id } = req.params;
    let invoice = await Invoice.findOne({ order: order_id }).populate("order").populate("user");
    let policy = policyFor(req.user);
    let subjectInvoice = subject("Invoice", { ...invoice, user_id: invoice.user._id });
    if (!policy.can("read", subjectInvoice)) {
      return res.json({
        err: 1,
        message: "you do not have access to view this",
      });
    }

    return res.json(invoice);
  } catch (err) {
    // if (err && err.name === "ValidationError") {
    //   return res.json({
    //     error: 1,
    //     message: err.message,
    //     fields: err.errors,
    //   });
    // }
    // next(err);
    return res.json({
      err: 1,
      message: "error when getting invoice",
      fields: err.errors,
    });
  }
};

module.exports = { show };
