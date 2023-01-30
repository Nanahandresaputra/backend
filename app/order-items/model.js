// order items ini memberikan informasi tentang produk apa saja yang dibeli

const mongoose = require("mongoose");
const { model, Schema } = mongoose;

const orderItemsSchema = Schema({
  name: {
    type: String,
    minlength: [5, "nama tidak boleh kurang dari 5 karakter"],
    required: [true, "nama harus diisi"],
  },
  price: {
    type: Number,
    required: [true, "harga harus diisi"],
  },
  quantity: {
    type: Number,
    required: [true, "kuantitas harus diisi"],
    min: [1, "kuantitas minimal 1"],
  },
  product: {
    type: Schema.Types.ObjectId,
    ref: "productFood",
  },
  order: {
    type: Schema.Types.ObjectId,
    ref: "Order",
  },
});

module.exports = model("OrderItems", orderItemsSchema);
