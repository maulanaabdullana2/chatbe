const express = require("express");
const cors = require("cors");
const morgan = require('morgan')
const app = express();

app.use(cors());

app.use(morgan('dev'))


app.get("/", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Hello World",
  });
});

module.exports = app;
