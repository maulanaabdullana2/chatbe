const http = require("http");
const mongoose = require("mongoose");
const Message = require("./models/MessagesModels");
const { Server } = require("socket.io");
const app = require("./app");
const PORT = process.env.PORT || 8000
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
    origin: `${process.env.FE_URL}`,
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  },
});

io.on("connection",(socket) => {
  console.log("INFO:", "seseorang telah bergabung ke chat room!");

  socket.on("chat message", async (msg) => {
    console.log("INFO:", "incoming message", JSON.stringify(msg));

    try {
      await Message.create({
        username: msg.username,
        message: msg.message,
      });

      msg.status = "sent";
      io.emit("incoming message", msg);
    } catch (err) {
      console.error("Error saving message to the database:", err);
    }
  });

   socket.on("get messages", async () => {
     try {
       const messages = await Message.find();
       socket.emit("messages", messages);
     } catch (err) {
       console.error("Error getting messages from the database:", err);
     }
   });


  socket.on("disconnect", () => {
    console.log("INFO:", "seseorang telah pergi dari chat room!");
  });
});

server.listen(PORT, () => {
  console.log("INFO:", "Listening on port 8000");
});
