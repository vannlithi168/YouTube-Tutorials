const express = require("express");
const session = require("express-session");
const passport = require("passport");
require("./auth");
const User = require("./models/User");

function isLoggedIn(req, res, next) {
  req.user ? next() : res.sendStatus(401);
}

const app = express();
app.use(
  session({
    secret: "cats",
    resave: true,
    saveUninitialized: true,
    rolling: true, // Add this line
    maxAge: 30000,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
  res.send('<a href="/auth/google">Authenticate with Google</a>');
});

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

app.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: "/protected",
    failureRedirect: "/auth/failure",
  })
);

app.get("/auth/failure", (req, res) => {
  res.send("something went wrong...");
});

app.get("/protected", isLoggedIn, (req, res) => {
  res.send(`User Data: ${req.user.displayName}`);
});

app.get("/logout", (req, res) => {
  console.log("Logging out...");
  req.logout();
  console.log("Cleared cookie...");
  res.clearCookie("connect.sid");
  console.log("Redirecting...");
  res.redirect("/");
});

app.listen(3000, () => console.log("Listening on: 3000"));
