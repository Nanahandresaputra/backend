const express = require("express");
const router = express.Router();
const invoiceControler = require("./controler");

router.get("/invoice", invoiceControler.show);

module.exports = router;
