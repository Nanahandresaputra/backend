const express = require("express");
const router = express.Router();
const { policy_check } = require("../../middlewares/index");
const orderControler = require("./controler");

router.get("/orders", policy_check("view", "Order"), orderControler.index);
router.post("/orders", policy_check("create", "Order"), orderControler.store);

module.exports = router;
