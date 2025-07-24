const express = require('express');
const mongoose = require('mongoose');
const redis = require('redis');
const dotenv = require('dotenv');
const cors = require('cors');
const http = require('http'); // ✅ required for socket.io
const { Server } = require('socket.io'); // ✅ import socket.io

const jobRoutes = require('./routes/jobRoutes');
require('./jobs/jobWorker');         // Background worker
require('./services/cronJob');       // Scheduled task

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5050;

// ✅ Create HTTP server manually
const server = http.createServer(app);

// ✅ Attach Socket.IO to HTTP server
const io = new Server(server, {
  cors: {
    origin: '*', // Or your frontend URL
    methods: ['GET', 'POST']
  }
});

// ✅ Make io globally accessible
global.io = io;

// 🔌 Socket connection handler
io.on('connection', (socket) => {
  console.log('⚡ New client connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('❌ Client disconnected:', socket.id);
  });
});

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Error:', err));

// Redis Connection
const redisClient = redis.createClient({ url: process.env.REDIS_URL });
redisClient.on('error', err => console.error('❌ Redis Client Error:', err));

redisClient.connect().then(() => {
  console.log('✅ Redis Connected');

  // Express Setup
  app.use(cors());
  app.use(express.json());
  app.use('/api/jobs', jobRoutes);

  // Start server
  server.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
});
