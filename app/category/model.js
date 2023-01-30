const mongoose = require("mongoose");
const { model, Schema } = mongoose;

const categoriesSchema = Schema({
  name: {
    type: String,
    minlength: [3, "nama tidak boleh kurang dari 3"],
    maxlength: [100, "nama tidak boleh lebih dari 100"],
    required: [true, "nama harus diisi"],
  },
});

module.exports = model("Categories", categoriesSchema);
