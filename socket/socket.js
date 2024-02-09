const { Server } = require("socket.io");
const Message = require("../models/MessagesModels");
require("dotenv").config();

module.exports = function (server) {
  const io = new Server(server, {
    cors: {
      origin: process.env.ORIGIN_URL, 
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
};
