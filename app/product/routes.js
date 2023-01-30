const express = require("express");
const multer = require("multer");
const os = require("os");
// jika didefinisikan secara langsung maka pada saat di deploy pada server yang berbeda maka bisa jadi gagal, kalo pakai os maka akan menyesuaikan sama os nya (os pada prangkat masing-masing)
const router = express.Router();
const productControler = require("./controler");
// menempatkan middleware otorisasi
const { policy_check } = require("../../middlewares/index");

router.get("/product", productControler.index);
router.get("/product/:id", productControler.productIndex);
router.delete("/product/:id", policy_check("delete", "product"), productControler.destroy);
router.post("/product", multer({ dest: os.tmpdir() }).single("image"), policy_check("create", "product"), productControler.store);
router.put("/product/:id", multer({ dest: os.tmpdir() }).single("image"), policy_check("update", "product"), productControler.update);
// tmdir yaitu tempat temporary directory atau tempat penyimpanan sementara pada os masing-masing

module.exports = router;
