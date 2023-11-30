const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth2").Strategy;

const GOOGLE_CLIENT_ID =
  "75543058548-pf22sek6rlu504d94iotgarhqm9vs7lb.apps.googleusercontent.com";
const GOOGLE_CLIENT_SECRET = "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";

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/google/callback",
      passReqToCallback: true,
    },
    function (request, accessToken, refreshToken, profile, cb) {
      // Log the entire profile data
      console.log("Google Profile Data:", profile);

      // Log the access token
      console.log("Access Token:", accessToken);

      // Log the refresh token
      console.log("Refresh Token:", refreshToken);

      // Assuming you want to pass the user profile to Passport
      return cb(null, profile);
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});
