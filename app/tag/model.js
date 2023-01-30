const mongoose = require("mongoose");
const { model, Schema } = mongoose;

const tagSchema = Schema({
  name: {
    type: String,
    minlength: [3, "nama tidak boleh kurang dari tiga"],
    maxlength: [20, "nama tidak boleh lebih dari 20"],
    required: true,
  },
});

module.exports = model("Tag", tagSchema);
