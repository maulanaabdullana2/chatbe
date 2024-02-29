const http = require("http");
const mongoose = require("mongoose");
const Message = require("./models/MessagesModels");
const { Server } = require("socket.io");
const app = require("./app");
const PORT = process.env.PORT || 8000;
require("dotenv").config();

const database = process.env.DATABASE_URL;
mongoose
  .connect(database, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Database berhasil terkoneksi");
  })
  .catch((error) => {
    console.error("Kesalahan koneksi database:", error);
  });

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "https://chatfe.vercel.app/",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("INFO:", "Seseorang telah bergabung ke chat room!");

  socket.on("chat message", async (msg) => {
    console.log("INFO:", "Pesan masuk", JSON.stringify(msg));

    try {
      const newMessage = await Message.create({
        username: msg.username,
        message: msg.message,
      });

      const formattedMessage = {
        _id: newMessage._id,
        username: newMessage.username,
        message: newMessage.message,
        createdAt: newMessage.createdAt,
        status: "sent",
      };

      io.emit("incoming message", formattedMessage);
    } catch (err) {
      console.error("Kesalahan menyimpan pesan ke database:", err);
    }
  });

  socket.on("get messages", async () => {
    try {
      const messages = await Message.find();
      socket.emit("messages", messages);
    } catch (err) {
      console.error("Kesalahan mendapatkan pesan dari database:", err);
    }
  });

  socket.on("disconnect", () => {
    console.log("INFO:", "Seseorang telah pergi dari chat room!");
  });
});

server.listen(PORT, () => {
  console.log(`INFO: Listening on port ${PORT}`);
});
