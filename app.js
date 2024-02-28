const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const ImageKit = require("imagekit");
const multer = require("multer");
const message = require("./models/MessagesModels");
const ApiError = require("./utils/ApiError");
const app = express();
require("dotenv").config();

app.use(
  cors({
    origin: `${process.env.FE_URL}`,
  }),
);

app.use(morgan("dev"));

const imagekit = new ImageKit({
  publicKey: "public_sXioiHdzKT21e05ecvacMrvDi20=",
  privateKey: "private_SJcwW7aeSvVhB9i83a261IYbAdA=",
  urlEndpoint: "https://ik.imagekit.io/rkdjvchqti",
});

const fileFilters = (req, file, cb) => {
  if (
    file.mimetype == "image/png" ||
    file.mimetype == "image/jpg" ||
    file.mimetype == "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(new ApiError("File not supported", 400));
  }
};

const storage = multer.memoryStorage();
const upload = multer({ storage: storage, fileFilter: fileFilters });

app.post("/upload", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      throw new ApiError("No file uploaded", 400);
    }
    const file = req.file.buffer.toString("base64");
    const result = await imagekit.upload({
      file: file,
      fileName: req.file.originalname,
    });

    const messages = await message.create({
      image: result.url,
    });
    res.json(messages);
  } catch (err) {
    console.error("Error uploading image:", err);
    res.status(err.statusCode || 500).json({ error: err.message });
  }
});

app.get("/", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Hello World",
  });
});

module.exports = app;
