const mongoose = require("mongoose");

const userShema = mongoose.Schema(
  {
    name: {
      type: String,
      require: [true, "Pleace add a name"],
    },
    email: {
      type: String,
      require: [true, "Pleace add a email"],
      unique: true,
    },
    password: {
      type: String,
      require: [true, "Pleace add a password"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userShema);
