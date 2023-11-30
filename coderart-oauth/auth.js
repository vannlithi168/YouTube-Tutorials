const passport = require("passport");
require("dotenv").config();
const User = require("./models/userModel");
const connectDB = require("./db");

connectDB();

const GoogleStrategy = require("passport-google-oauth2").Strategy;

passport.use(
  new GoogleStrategy(
    {
      clientID: "",
      clientSecret: "",
      callbackURL: "http://localhost:3001/auth/google/callback",
      passReqToCallback: true,
    },
    async function (request, accessToken, refreshToken, profile, done) {
      try {
        console.log("Google Profile Information:", profile);
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
          user = new User({
            email:
              profile.emails && profile.emails.length > 0
                ? profile.emails[0].value
                : null,
            profilePicture:
              profile.photos && profile.photos.length > 0
                ? profile.photos[0].value
                : null,
            firstName: profile.given_name || null,
            lastName: profile.family_name || null,
            userName: profile.displayName || null,
            gender: profile.gender || "Other",
            birthDate: 0,
            password: "DefaultPassword", // Set a unique password or handle this based on your authentication flow
            phoneNumber: 0,
            verified: profile.email_verified,
          });

          await user.save();
        }

        done(null, user);
      } catch (error) {
        console.error("Error during GoogleStrategy:", error);
        done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});
