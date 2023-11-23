// models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  googleId: String,
  displayName: String,
  // Add other fields you want to store
});

const User = mongoose.model("User", userSchema);

module.exports = User;
