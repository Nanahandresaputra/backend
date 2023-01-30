const express = require("express");
const router = express.Router();
const authControler = require("./controler");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

// secara default LocalStrategi menerima kolom username dan password, karena yang dikirimkan email maka perlu tamnahan konfigurasi
passport.use(new LocalStrategy({ usernameField: "email" }, authControler.localStrategy));

router.post("/register", authControler.register);
router.post("/login", authControler.login);
router.post("/logout", authControler.logout);
router.get("/me", authControler.me);

module.exports = router;
