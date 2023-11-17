const router = require("express").Router();
const { User, validate } = require("../models/user");
const bcrypt = require("bcrypt");
const Token = require("../models/token");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");

router.post("/signup", async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    let user = await User.findOne({ email: req.body.email });
    if (user)
      return res
        .status(409)
        .send({ message: "User with given email already exists" });

    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    // Assuming your User model expects "firstname" and "lastname"
    const newUser = new User({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      password: hashPassword,
    });

    user = await newUser.save();

    const token = await new Token({
      userId: user._id,
      token: crypto.randomBytes(32).toString("hex"),
    }).save();

    const url = `${process.env.BASE_URL}/user/${user._id}/verify/${token.token}`;
    await sendEmail(user.email, "Verify Email", url);

    res
      .status(201)
      .send({ message: "An email sent to your account please verify" });
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

router.get("/:id/verify/:token/", async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id });

    if (!user) {
      console.error("Invalid user ID");
      return res.status(400).send({ message: "Invalid link" });
    }

    const token = await Token.findOne({
      userId: user._id,
      token: req.params.token,
    });

    if (!token) {
      console.error("Invalid token");
      return res.status(400).send({ message: "Invalid link" });
    }

    const updatedUser = await User.findOneAndUpdate(
      { _id: user._id },
      { verified: true },
      { new: true }
    );

    if (!updatedUser) {
      console.error("Failed to update user verification status");
      return res.status(500).send({ message: "Internal Server Error" });
    }

    // Check if token is defined before calling remove
    if (token && typeof token.remove === "function") {
      await token.remove();
    } else {
      console.error("Token not found or remove method not available");
    }

    console.log("Email verified successfully");
    res.status(200).send({ message: "Email verified successfully" });
  } catch (error) {
    console.error("Verify Email Error:", error);
    res
      .status(500)
      .send({ message: "Internal Server Error", error: error.message });
  }
});

module.exports = router;
