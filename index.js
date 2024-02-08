const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const router = require("./router");
const createSocket = require("./socket/socket");

// Load environment variables
require("dotenv").config();

const corsOptions = {
  origin: "https://fe-socket-ashy.vercel.app",
  optionsSuccessStatus: 200, // Untuk beberapa browser lama
};

app.use(cors(corsOptions));
app.use(express.json());

// Database connection
const database = process.env.DATABASE_URL;
mongoose
  .connect(database, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Database Berhasil Terkoneksi");
  })
  .catch((error) => {
    console.error("Database connection error:", error);
  });

// Routes
app.use(router);

// Server setup
const port = process.env.PORT || 8000;
const server = app.listen(port, () => {
  console.log("INFO:", `Listening on port ${port}`);
});

// WebSocket setup
createSocket(server);
