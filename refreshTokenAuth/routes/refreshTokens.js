import { Router } from "express";
import UserToken from "../models/UserToken.js";
import jwt from "jsonwebtoken";
import verifyRefreshToken from "../utils/verifyRefreshToken.js";
import { refreshTokenBodyValidation } from "../utils/validationSchema.js";

const router = Router();

console.log("Hit refreshToken route");

//get new access token
router.post("/", async (req, res) => {
  const { error } = refreshTokenBodyValidation(req.body);
  if (error)
    return res
      .status(400)
      .json({ error: true, message: error.details[0].message });

  try {
    const result = await verifyRefreshToken(req.body.refreshToken);

    if (result.error) {
      console.error(result.message); // Log the error for debugging purposes
      return res.status(400).json(result);
    }

    const { tokenDetails } = result;

    if (!tokenDetails || !tokenDetails._id) {
      // Check if tokenDetails or _id is undefined
      console.error("Invalid tokenDetails structure"); // Log the error for debugging purposes
      return res.status(400).json({
        error: true,
        message: "Invalid tokenDetails structure",
      });
    }

    const payload = { _id: tokenDetails._id, roles: tokenDetails.roles };
    const accessToken = jwt.sign(
      payload,
      process.env.ACCESS_TOKEN_PRIVATE_KEY,
      { expiresIn: "14m" }
    );

    res.status(200).json({
      error: false,
      accessToken,
      message: "Access token created successfully",
    });
  } catch (err) {
    console.error(err); // Log the error for debugging purposes
    res.status(500).json({ error: true, message: "Internal Server Error" });
  }
});

// logout
router.delete("/", async (req, res) => {
  try {
    const { error } = refreshTokenBodyValidation(req.body);
    if (error)
      return res
        .status(400)
        .json({ error: true, message: error.details[0].message });

    const userToken = await UserToken.findOne({ token: req.body.refreshToken });
    if (!userToken)
      return res
        .status(200)
        .json({ error: false, message: "Logged Out Successfully" });

    await UserToken.deleteOne({ token: req.body.refreshToken });

    res.status(200).json({ error: false, message: "Logged Out Successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: true, message: "Internal Server Error" });
  }
});

export default router;
