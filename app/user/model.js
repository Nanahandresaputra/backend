const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const AutoIncrement = require("mongoose-sequence")(mongoose);
const bcrypt = require("bcrypt");

const userSchema = Schema(
  {
    full_name: {
      type: String,
      required: [true, "nama harus diisi"],
      maxlength: [100, "panjang nama harus antara 3 - 100 karakter"],
      minlength: [3, "panjang nama harus antara 3 - 100 karakter"],
    },
    costumer_id: {
      type: Number,
    },
    email: {
      type: String,
      required: [true, "email harus diisi"],
      maxlength: [100, "email maksimal 100 karakter"],
    },
    password: {
      type: String,
      required: [true, "password harus diisi"],
      minlength: [3, "password harus diisi antara 3-20 karakter"],
      maxlength: [20, "password harus diisi antara 3-20 karakter"],
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    token: {
      type: [String],
    },
  },
  { timestamps: true }
);

// karena mongoose belum suport validasi email maka buat validasi untuk email maka buat validasi email
userSchema.path("email").validate(
  function (value) {
    const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return EMAIL_RE.test(value);
  },
  (attr) => `${attr.value} harus merupakan email yang valid`
);

// membuat pengecekan apakah email tersebut sudah terdaftar atau belum
userSchema.path("email").validate(
  async function (value) {
    try {
      // (1) lakukan pencarian ke_collection_User berdasarkan 'email
      const count = await this.model("User").count({ email: value });

      // (2) kode ini mengindikasikan bahwa jika user ditemukan akan mengembalikan 'false' jika tidak ditemukan akan mengembalikan 'true
      // jika 'false' validasi gagal
      // jika 'true' validasi berhasil
      return !count;
    } catch (err) {
      throw err;
    }
  },
  (attr) => `${attr.value} sudah terdaftar`
);

// membuat fitur hashing password
const HASH_ROUND = 10;
userSchema.pre("save", function (next) {
  this.password = bcrypt.hashSync(this.password, HASH_ROUND);
  next();
});

// menambahkan auroIncrement mongoose pada user_id
userSchema.plugin(AutoIncrement, { inc_field: "costumer_id" });

module.exports = model("User", userSchema);
