const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true },
  password: {
    type: String,
    required: true },
  isAdmin: {
    type: Boolean,
    required: true
  }
});

module.exports = mongoose.model("User", userSchema);
