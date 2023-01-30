const User = require("../user/model");
const bcrypt = require("bcrypt");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const config = require("../config");
const { getToken } = require("../../utils/index");

// -------------REGISTER------------------
const register = async (req, res, next) => {
  try {
    const payload = req.body;
    let user = new User(payload);
    await user.save();
    return res.json(user);
  } catch (err) {
    if (err && err.name === "ValidationError") {
      res.json({
        error: 1,
        message: err.message,
        fields: err.errors,
      });
    }
    next(err);
  }
};

// ---------------LOGIN--------------------
// login midleware
const localStrategy = async (email, password, done) => {
  try {
    let user = await User.findOne({ email }).select("-__v -createdAt -updatedAt -token");
    if (!user) return done();
    if (bcrypt.compareSync(password, user.password)) {
      const { password, ...userWithoutPassword } = user.toJSON();
      return done(null, userWithoutPassword);
    }
  } catch (err) {
    done(err, null);
  }
  done();
};
// login method
const login = (req, res, next) => {
  passport.authenticate("local", async function (err, user) {
    if (err) {
      return next(err);
    }
    if (!user) {
      res.json({
        error: 1,
        // untuk mengecoh peretas maka kasih pesan message yang ambigu
        message: "email or password incorect",
      });
    }
    let signed = jwt.sign(user, config.secretKey);
    await User.findByIdAndUpdate(user._id, { $push: { token: signed } });
    res.json({
      message: "Login Succesfully",
      user,
      token: signed,
    });
  })(req, res, next);
};

// ---------------LOGOUT-------------------
const logout = async (req, res, next) => {
  let token = getToken(req);
  let user = await User.findOneAndUpdate({ token: { $in: [token] } }, { $pull: { token: token } }, { useFindAndModify: false });
  if (!token || !user) {
    res.json({
      err: 1,
      message: "no user found!!!",
    });
  }

  return res.json({
    err: 0,
    message: "Logout succesfully",
  });
};

// testing apakah masih login atau sudah logout
const me = (req, res, next) => {
  if (!req.user) {
    res.json({
      err: 1,
      message: "You are not login or token expired",
    });
  }
  res.json(req.user);
};

module.exports = {
  register,
  localStrategy,
  login,
  logout,
  me,
};
