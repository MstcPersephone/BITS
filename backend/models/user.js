// Importing Mongoose
const mongoose = require("mongoose");

// Creating the User schema (blueprint)
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

// Creating and exporting the User shell model
module.exports = mongoose.model("User", userSchema);
