const express = require("express");
const router = express.Router();
const { policy_check } = require("../../middlewares/index");
const cartContoler = require("./controler");

router.put("/cart", policy_check("update", "Cart"), cartContoler.update);
router.get("/cart", policy_check("read", "Cart"), cartContoler.index);

module.exports = router;
