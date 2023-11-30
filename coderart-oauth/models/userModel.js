const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      trim: true,
      required: [true, "First name is required."],
    },
    lastName: {
      type: String,
      required: [true, "First name is required."],
      trim: true,
    },
    userName: {
      type: String,
      required: [true, "First name is required."],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "First name is required."],
      trim: true,
      validate: {
        validator: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
        message: "Invalid email format.",
      },
    },
    phoneNumber: {
      type: Number,
      required: [true, "First name is required."],
      validate: {
        validator: function (value) {
          return /^\d+$/.test(value);
        },
        message: "Phone number can only contain numeric characters.",
      },
    },
    birthDate: {
      type: Date,
      required: [true, "Birthdate is required."],
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      required: [true, "Gender is required."],
    },
    address: {
      city: {
        type: String,
        trim: true,
      },
      commune: {
        type: String,
        trim: true,
      },
      district: {
        type: String,
        trim: true,
      },
      village: {
        type: String,
        trim: true,
      },
      homeNumber: {
        type: Number,
        trim: true,
      },
      street: {
        type: String,
        trim: true,
      },
    },
    profilePicture: String,
    role: {
      type: String,
      enum: ["user", "supplier", "admin"],
      default: "user",
    },
    password: {
      required: [true, "First name is required."],
      type: String,
    },

    verified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);

  // Delete passwordConfirm field
  this.confirmPassword = undefined;

  // Update passwordChangedAt
  this.passwordChangedAt = Date.now() - 1000;

  next();
});

// Define a method to compare passwords
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
