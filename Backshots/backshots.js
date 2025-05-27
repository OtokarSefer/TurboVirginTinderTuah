require("dotenv").config();
const express = require("express");
const cors = require("cors");
const authRoutes = require('./router/authRoutes');
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

const app = express();

const http = require("http");
const server = http.createServer(app);

const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PATCH"],
    credentials: true,
  }
});


app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ['GET', 'POST', 'PATCH'],
    credentials: true,
  })
);

app.use('/api', authRoutes);

app.get("/", (req, res) => {
  res.send("Server is running!");
});

app.get("/auth/verify", (req, res) => {
  const token = req.cookies.authToken;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_TOKEN);
    return res.json({ authenticated: true, userId: decoded.userId });
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
});

app.post("/logout", (req, res) => {
  res.clearCookie("authToken");
  return res.json({ message: "Logged out successfully" });
});

const users = new Map();

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  let currentUserId = null;

  socket.on('identify', (userId) => {
    currentUserId = userId;
    users.set(userId, socket.id);
    console.log(`User identified: ${userId} with socket ${socket.id}`);
  });

  socket.on('sendMessage', ({ receiverId, content, timestamp }) => {
    if (!currentUserId) {
      console.log('sendMessage received but sender not identified yet');
      return;
    }

    const receiverSocketId = users.get(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('receiveMessage', {
        senderId: currentUserId,
        receiverId,
        content,
        timestamp,
      });
    }

    // You can add DB save logic here
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    if (currentUserId) {
      users.delete(currentUserId);
    }
  });
});

PORT = 5000

server.listen(PORT, () => {
  console.log(`Server and socket.io running on http://localhost:${PORT}`);
});
