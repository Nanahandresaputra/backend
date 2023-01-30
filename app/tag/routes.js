const express = require("express");
const tagControler = require("./controler");
const router = express.Router();
const { policy_check } = require("../../middlewares/index");

router.get("/tag", tagControler.index);
router.post("/tag", policy_check("create", "tag"), tagControler.store);
router.put("/tag/:id", policy_check("update", "tag"), tagControler.update);
router.get("/tag/:id", tagControler.view);
router.delete("/tag/:id", policy_check("delete", "tag"), tagControler.destroy);

module.exports = router;
