const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Хэрэглэгчийн нэрийг заавал оруулна уу!!!"],
  },
  email: {
    type: String,
    required: [true, "Хэрэглэгчийн И-мэйл хаягийг оруулна уу!!!"],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "И-мэйл хаяг буруу байна!!!",
    ],
  },
  role: {
    type: String,
    required: [true, "Хэрэглэгчийн эрхийн төрлийг оруулж өгнө үү!!!"],
    enum: ["user", "operator", "admin"],
    default: "user",
  },
  password: {
    type: String,
    minlength: 4,
    required: [true, "Нууц үгээ оруулна уу!!!"],
    select: false, //Ингэснээр АПП талаас шууд харуулахгүй юм
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
UserSchema.pre("save", async function () {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.getJsonWebToken = function () {
  const token = jwt.sign(
    {
      id: this._id,
      role: this.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES }
  );

  return token;
};
UserSchema.methods.checkPassword = async function (enteredPassword) {
  console.log("password shalgaj bna.........");
  return await bcrypt.compare(enteredPassword, this.password);
};
module.exports = mongoose.model("User", UserSchema);
