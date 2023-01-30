const mongoose = require("mongoose");
const { model, Schema } = mongoose;

const productSchema = Schema(
  {
    name: {
      type: String,
      minlength: [3, "panjang nama minimal 3"],
      required: [true, "nama harus diisi"],
    },
    description: {
      type: String,
      maxlength: [1000, "panjang maksimal 1000"],
    },
    price: {
      type: Number,
      default: 0,
    },
    image_url: {
      type: String,
    },
    // relasional dari category
    category: {
      type: Schema.Types.ObjectId,
      ref: "Categories",
    },
    tags: {
      type: [Schema.Types.ObjectId],
      ref: "Tag",
    },
  },
  { timestamps: true }
);

module.exports = model("productFood", productSchema);
