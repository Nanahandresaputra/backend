const mongoose = require("mongoose");
const { model, Schema } = mongoose;

const addressSchema = Schema(
  {
    nama: {
      type: String,
      required: [true, "nama harus diisi"],
      maxlength: [255, "nama tidak boleh lebih dari 255 karakter"],
    },
    kelurahan: {
      type: String,
      required: [true, "kelurahan harus diisi"],
      maxlength: [255, "kelurahan tidak boleh lebih dari 255 karakter"],
    },
    kecamatan: {
      type: String,
      required: [true, "kecamatan harus diisi"],
      maxlength: [255, "kecamatan tidak boleh lebih dari 255 karakter"],
    },
    kabupaten: {
      type: String,
      required: [true, "kabupaten harus diisi"],
      maxlength: [255, "kabupaten tidak boleh lebih dari 255 karakter"],
    },
    provinsi: {
      type: String,
      required: [true, "provinsi harus diisi"],
      maxlength: [255, "provinsi tidak boleh lebih dari 255 karakter"],
    },
    detail: {
      type: String,
      required: [true, "detail harus diisi"],
      maxlength: [255, "detail tidak boleh lebih dari 255 karakter"],
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = model("Address", addressSchema);
