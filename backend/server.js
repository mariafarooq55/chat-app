const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const Message = require("./models/Message");
const User = require("./models/User");

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api", require("./routes/messageRoutes"));

app.get("/", (req, res) => {
  res.send("Chat API is running...");
});

// Socket.io
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Join a room
  socket.on("join_room", (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room ${roomId}`);
  });

  // Send message
  socket.on("send_message", async (data) => {
    const { content, sender, room } = data;
    try {
      const message = await Message.create({ content, sender, room });
      const populatedMessage = await message.populate("sender", "username");
      io.to(room).emit("receive_message", populatedMessage);
    } catch (error) {
      console.log(error.message);
    }
  });

  // User online status
  socket.on("user_online", async (userId) => {
    await User.findByIdAndUpdate(userId, { isOnline: true });
    io.emit("user_status", { userId, isOnline: true });
  });

  // Disconnect
  socket.on("disconnect", async () => {
    console.log("User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
