import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

// Socket.io needs access to the underlying HTTP server to work properly.
// This is why we pass server to new Server(server, {...}), allowing:
// HTTP requests to be handled by Express (app).
// WebSocket connections to be handled by Socket.io.

const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:3000",
      "http://172.18.96.1:3000", // Add this IP address
    ],
  },
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

  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, app, server };
