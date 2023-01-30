// logout
const { getToken, policyFor } = require("../utils/index");
const config = require("../app/config");
const jwt = require("jsonwebtoken");
const User = require("../app/user/model");

// middleware untuk logout
function decodeToken() {
  return async function (req, res, next) {
    try {
      let token = getToken(req);
      if (!token) return next();
      req.user = jwt.verify(token, config.secretKey);

      let userToken = await User.findOne({ token: { $in: [token] } });
      if (!userToken) {
        res.json({
          error: 1,
          message: "Token Expired",
        });
      }
    } catch (err) {
      if (err && err.name === "JsonWebTokenError") {
        res.json({
          err: 1,
          message: err.message,
        });
      }
      next(err);
    }
    return next();
  };
}

// middlewara untuk hak akses (otorisasi)
// karena middleware ini sifatnya tidak global atau per action maka ditempelkan disetiap aksi (di routingan product contohnya)
function policy_check(action, subject) {
  return function (req, res, next) {
    let policy = policyFor(req.user);
    if (!policy.can(action, subject)) {
      return res.json({
        error: 1,
        message: `You are not allowed to ${action} ${subject}`,
      });
    }
    next();
  };
}

module.exports = { decodeToken, policy_check };
// selanjutnya export ke app.js
