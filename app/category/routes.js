const express = require("express");
const categoriesControler = require("./controler");
const router = express.Router();
const { policy_check } = require("../../middlewares/index");

router.get("/category", categoriesControler.index);
router.get("/category/:id", categoriesControler.view);
router.delete("/category/:id", policy_check("delete", "category"), categoriesControler.destroy);
router.post("/category", policy_check("create", "category"), categoriesControler.store);
router.put("/category/:id", policy_check("update", "category"), categoriesControler.update);

module.exports = router;
