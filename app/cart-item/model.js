const mongoose = require("mongoose");
const { model, Schema } = mongoose;

const cartSchema = Schema({
  name: {
    type: String,
    required: [true, "nama harus diisi"],
    minlength: [5, "panjang minimal 5 karakter"],
  },
  quantity: {
    type: Number,
    required: [true, "quantity harus diisi"],
    min: [1, "minimal 1"],
  },
  price: {
    type: Number,
    default: 0,
  },
  image_url: String,
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  product: {
    type: Schema.Types.ObjectId,
    ref: "productFood",
  },
});

module.exports = model("Cart", cartSchema);
