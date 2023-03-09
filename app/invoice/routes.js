const express = require("express");
const router = express.Router();
const invoiceControler = require("./controler");

router.get("/invoice/:order_id", invoiceControler.show);

module.exports = router;
