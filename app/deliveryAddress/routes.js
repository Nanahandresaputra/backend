const express = require("express");
const router = express.Router();
const addressControler = require("./controler");
const { policy_check } = require("../../middlewares/index");

router.get("/addres", policy_check("view", "DeliveryAddress"), addressControler.index);
router.get("/addres/:id", policy_check("view", "DeliveryAddress"), addressControler.view);
router.put("/addres/:id", addressControler.update);
router.delete("/addres/:id", addressControler.destroy);
router.post("/addres", policy_check("create", "DeliveryAddress"), addressControler.store);

module.exports = router;
