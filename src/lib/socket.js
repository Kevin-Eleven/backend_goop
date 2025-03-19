import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

// Socket.io needs access to the underlying HTTP server to work properly.
// This is why we pass server to new Server(server, {...}), allowing:
// HTTP requests to be handled by Express (app).
// WebSocket connections to be handled by Socket.io.
const allowedOrigins = [
  "http://localhost:3000",
  "http://172.18.96.1:3000",
  "https://goop-vert.vercel.app",
  "https://goop-haris-projects-512fafb0.vercel.app", // Add your Vercel domain
];

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  },
  allowEIO3: true, // Helps with compatibility
  transports: ["websocket", "polling"], // Explicitly define the transports to match client
});

export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

// used to store online users
const userSocketMap = {}; // {userId: socketId}

io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  // query object passed from frontend to get userId
  const userId = socket.handshake.query.userId;
  if (userId) userSocketMap[userId] = socket.id;

  // io.emit() is used to send events to all the connected clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // Debug connection
  socket.on("error", (error) => {
    console.log("Socket error:", error);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, app, server };
