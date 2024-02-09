const http = require("http");
const mongoose = require("mongoose");
const Message = require("./models/MessagesModels");
const { Server } = require("socket.io");
const app = require("./app");
require("dotenv").config();



const database = process.env.DATABASE_URL;
mongoose
  .connect(database, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Database Berhasil Terkoneksi");
  })
  .catch((error) => {
    console.error("Database connection error:", error);
  });

const server = http.createServer(app);
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
      allowedHeaders: ["Content-Type", "Authorization"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("INFO:", "seseorang telah bergabung ke chat room!");

    socket.on("chat message", async (msg) => {
      console.log("INFO:", "incoming message", JSON.stringify(msg));
      io.emit("incoming message", msg);

      // Simpan pesan ke dalam database
      try {
        await Message.create({
          username: msg.username,
          message: msg.message,
        });
      } catch (err) {
        console.error("Error saving message to the database:", err);
      }
    });

    socket.on("disconnect", () => {
      console.log("INFO:", "seseorang telah pergi dari chat room!");
    });
  });
server.listen(8000, () => {
  console.log("INFO:", "Listening on port 8000");
});
