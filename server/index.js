const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const settingRoutes = require("./routes/settingRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

dotenv.config();

connectDB();
const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("API is Running");
});

app.use("/api/user", userRoutes);
app.use("/api/setting", settingRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT;

const server = app.listen(PORT, console.log(`Server Started on PORT ${PORT}`));

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: { origin: "http://localhost:3000" },
});

io.on("connection", (socket) => {
  console.log("Connected to socket.io");

  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (roomId) => {
    socket.join(roomId);
    console.log("User joined room: " + roomId);
  });

  socket.on("send message", (newMessageSent) => {
    var chat = newMessageSent.chat;
    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id === newMessageSent.sender._id) return;

      socket.in(user._id).emit("message received", newMessageSent);
    });
  });
});
