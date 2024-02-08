const express = require("express");
const cors = require("cors");
const morgan = require('morgan')
const app = express();


const corsOptions = {
  origin: "https://fe-socket-ashy.vercel.app",
  optionsSuccessStatus: 200, // Untuk beberapa browser lama
};

app.use(cors(corsOptions));

app.use(morgan('dev'))


app.get("/", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Hello World",
  });
});

module.exports = app;
