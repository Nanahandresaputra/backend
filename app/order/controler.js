const CartItem = require("../cart-item/model");
const DeliveryAddress = require("../deliveryAddress/model");
const OrderItmes = require("../order-items/model");
const Order = require("./model");
const { Types } = require("mongoose");

const store = async (req, res, next) => {
  try {
    let { delivery_address, delivery_fee } = req.body;
    let items = await CartItem.find({ user: user._id }).populate("productFood");
    if (!items) {
      return res.json({
        err: 1,
        message: "kamu tidak bisa membuat pesanan karena tidak ada barang di keranjang",
      });
    }

    let address = await DeliveryAddress.findById(delivery_address);
    let order = new Order({
      _id: new Types.ObjectId(),
      status: "waiting_payment",
      delivery_fee: delivery_fee,
      delivery_address: {
        provinsi: address.provinsi,
        kabupaten: address.kabupaten,
        kecamatan: address.kecamatan,
        detail: address.detail,
      },
      user: user._id,
    });

    let orderItems = await OrderItmes.insertMany(
      items.map((item) => ({
        ...item,
        name: item.product.name,
        quantity: item.product.quantity,
        price: item.product.price,
        order: order._id,
        product: item.product.id,
      }))
    );

    orderItems.forEach((item) => order.order_items.push(item));
    order.save();
    await CartItem.deleteMany({ user: req.user._id });
    return res.json(order);
  } catch (err) {
    if (err && err.name === "ValidationError") {
      return res.json({
        err: 1,
        message: err.message,
        error: err.errors,
      });
    }
    next(err);
  }
};

const index = async (req, res, next) => {
  try {
    let { skip = 0, limit = 10 } = req.query;
    let count = await Order.find({ user: req.user._id }).countDocuments();
    let orders = await Order.find({ user: req.user._id }).skip(parseInt(skip)).limit(parseInt(limit)).populate("order_items").sort("-createdAt");
    return res.json({
      data: orders.map((order) => order.toJSON({ virtuals: true })),
      count,
    });
  } catch (err) {
    if (err && err.name === "ValidationError") {
      return res.json({
        err: 1,
        message: err.message,
        errors: err.errors,
      });
    }
    next(err);
  }
};

module.exports = { store, index };
