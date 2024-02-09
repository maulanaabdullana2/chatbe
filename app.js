const express = require("express");
const cors = require("cors");
const morgan = require('morgan')
const app = express();
const router = require("./router");

app.use(cors());

app.use(router)

app.use(morgan('dev'))

app.get("/", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Hello World",
  });
});

module.exports = app;
