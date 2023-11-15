const express = require("express");
require("dotenv").config();
const connection = require("./db");
const cors = require("cors");

const app = express();

// database connection
connection();

// middlewares
app.use(express.json());
app.use(cors());

const port = process.env.PORT || 8080;
app.listen(port, console.log(`Listening on port ${port}...`));
