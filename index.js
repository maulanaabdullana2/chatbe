const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const app = express();
const router = require("./router");
const createSocket = require("./socket/socket");
const server = http.createServer(app);
require("dotenv").config();
app.use(express.json());

const database = process.env.DATABASE_URL;
mongoose
  .connect(database, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Database Berhasil Terkoneksi");
  })
  .catch((error) => {
    console.error("Database connection error:", error);
  });

  

app.use(router);



app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept",
  );
  next();
});

createSocket(server);





const port = process.env.PORT || 8000;
server.listen(port, () => {
  console.log("INFO:", `Listening on port ${port}`);
});



