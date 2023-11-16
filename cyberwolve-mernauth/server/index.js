const express = require("express");
require("dotenv").config();
const connection = require("./db");
const cors = require("cors");
const userRoutes = require("./routes/user");
const authRoutes = require("./routes/auth");

const app = express();

// database connection
connection();

// middlewares
app.use(express.json());
app.use(cors());

//routes
app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);

const port = process.env.PORT || 8080;
app.listen(port, console.log(`Listening on port ${port}...`));
