const express = require("express");
const path = require("path");
const app = express();
const session = require("express-session");
require("./auth");
const passport = require("passport");

app.use(express.json());
app.use(express.static(path.join(__dirname, "client")));

function isLoggedIn(req, res, next) {
  req.user ? next() : res.sendStatus(401);
}

app.get("/", (req, res) => {
  res.sendFile("index.html");
});

app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: "/auth/protected",
    failureRedirect: "/auth/failure",
  })
);

app.get("/auth/protected", isLoggedIn, (req, res) => {
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

app.get("/auth/failure", (req, res) => {
  res.send("Something went wrong!");
});

app.use("/auth/logout", (req, res) => {
  req.session.destroy();
  res.send("Goodbye");
});

app.listen(3001, () => {
  console.log("Listening on port 3001");
});

//testing
