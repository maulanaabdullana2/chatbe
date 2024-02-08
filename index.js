const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const app = express();
const router = require("./router");
const createSocket = require("./socket/socket");
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

const server = http.createServer(app);
const port = process.env.PORT || 8000;
server.listen(port, () => {
  console.log("INFO:", `Listening on port ${port}`);
});

// WebSocket setup (memanggil fungsi inisialisasi soket)
createSocket(server);
