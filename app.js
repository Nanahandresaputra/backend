var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const cors = require("cors");
const { decodeToken } = require("./middlewares/index");

// router
const routerProduct = require("./app/product/routes");
const routerCategory = require("./app/category/routes");
const routerTag = require("./app/tag/routes");
const authRouter = require("./app/auth/routes");
const addressRouter = require("./app/deliveryAddress/routes");
const cartRouter = require("./app/cart/routes");
const orderRouter = require("./app/order/routes");
const invoiceRouter = require("./app/invoice/routes");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// middlewares
app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(decodeToken());

// routing
app.use("/auth/", authRouter);
app.use("/api/v1/", routerProduct);
app.use("/api/v1/", routerCategory);
app.use("/api/v1/", routerTag);
app.use("/api/v1/", addressRouter);
app.use("/api/v1/", cartRouter);
app.use("/api/v1/", orderRouter);
app.use("/api/v1/", invoiceRouter);

// home
app.use("/", function (req, res) {
  res.render("index", {
    title: "eduwork service",
  });
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
