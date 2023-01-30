const Invoice = require("./model");
const { policyFor } = require("../../utils/index");
const { subject } = require("@casl/ability");

const show = async (req, res, next) => {
  try {
    let policy = policyFor(req.user);
    let subjectInvoice = subject("Invoice", { ...Invoice, user_id: Invoice.user._id });
    if (!policy("read", subjectInvoice)) {
      return res.json({
        err: 1,
        message: "you do not have access to view this",
      });
    }

    let { order_id } = req.params;
    let invoice = await Invoice.findOne({ order: order_id }).populate("order").populate("user");
    return res.json(invoice);
  } catch (err) {
    return res.json({
      err: 1,
      message: "error when getting invoice",
    });
  }
};

module.exports = { show };
