import express from "express";

import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import { connectDB } from "./lib/db.js";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";

import { app, server } from "./lib/socket.js";

dotenv.config();

app.use(cookieParser());
const allowedOrigins = [
  "http://localhost:3000",
  "http://172.18.96.1:3000",
  "https://goop-vert.vercel.app",
  "https://goop-haris-projects-512fafb0.vercel.app", // Add your Vercel domain
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use(express.json({ limit: "50mb" })); // Increase JSON limit to 50MB
app.use(express.urlencoded({ extended: true, limit: "50mb" })); // Increase URL-encoded limit

const port = process.env.PORT;

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// Uses Express's built-in server handling (which internally calls http.createServer(app)).

/*const app = express();
const server = http.createServer(app); // Manually creating the HTTP server

server.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});*/

// these both are equivalent

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  connectDB();
});

/*

const http = require("http"); // Import Node.js core module

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.write("Hello World");
  res.end();
});

server.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});

*/
