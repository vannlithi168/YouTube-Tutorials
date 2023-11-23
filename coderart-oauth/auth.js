const passport = require("passport");
require("dotenv").config();

const GoogleStrategy = require("passport-google-oauth2").Strategy;

passport.use(
  new GoogleStrategy(
    {
      clientID:
        "75543058548-pf22sek6rlu504d94iotgarhqm9vs7lb.apps.googleusercontent.com",
      clientSecret: "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",
      callbackURL: "http://localhost:3001/auth/google/callback",
      passReqToCallback: true,
    },
    function (request, accessToken, refreshToken, profile, done) {
      done(null, profile);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});
