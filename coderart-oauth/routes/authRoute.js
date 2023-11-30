const express = require("express");
const passport = require("passport");

const router = express.Router();

function isLoggedIn(req, res, next) {
  req.user ? next() : res.sendStatus(401);
}

router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: "/auth/protected",
    failureRedirect: "/auth/failure",
  })
);

router.get("/auth/protected", isLoggedIn, (req, res) => {
  const user = req.user;

  // Render an HTML page and pass user data to it
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Protected Page</title>
      </head>
      <body>
        <h1>Hello ${user.displayName}</h1>
        <p>Email: ${user.email}</p>
        <p>Given Name: ${user.given_name}</p>
        <p>Family Name: ${user.family_name}</p>
        <p>Family Name: ${user.language}</p>
        <p>Family Name: ${user.id}</p>
      </body>
    </html>
  `);
});

router.get("/auth/failure", (req, res) => {
  res.send("Something went wrong!");
});

router.use("/auth/logout", (req, res) => {
  req.session.destroy();
  res.send("Goodbye");
});

module.exports = router;
