import UserToken from "../models/UserToken.js";
import jwt from "jsonwebtoken";

const verifyRefreshToken = async (refreshToken) => {
  try {
    const privateKey = process.env.REFRESH_TOKEN_PRIVATE_KEY;

    // Use await with findOne to get the userToken
    const userToken = await UserToken.findOne({ token: refreshToken });

    // If userToken is not found, reject with an error
    if (!userToken) {
      throw { error: true, message: "Invalid refresh token" };
    }

    // Verify the refreshToken using jwt.verify
    const tokenDetails = jwt.verify(refreshToken, privateKey);

    // Resolve with tokenDetails if verification is successful
    return {
      tokenDetails,
      error: false,
      message: "Valid refresh token",
    };
  } catch (err) {
    // Reject with an error if any error occurs
    return { error: true, message: "Invalid refresh token" };
  }
};

export default verifyRefreshToken;
