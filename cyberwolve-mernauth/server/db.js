const mongoose = require("mongoose");

module.exports = async () => {
  try {
    await mongoose.connect(process.env.DB);
    console.log("Connected to database successfully");
  } catch (error) {
    console.error("Error connecting to the database:", error.message);
    console.log("Could not connect to the database!");
  }
};
