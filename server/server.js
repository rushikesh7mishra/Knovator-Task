const express = require('express');
const mongoose = require('mongoose');
const redis = require('redis');
const dotenv = require('dotenv');
const cors = require('cors');
const http = require('http'); 
const { Server } = require('socket.io'); 

const jobRoutes = require('./routes/jobRoutes');
require('./jobs/jobWorker');
require('./services/cronJob');      

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5050;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*', 
    methods: ['GET', 'POST']
  }
});

global.io = io;

io.on('connection', (socket) => {
  console.log('⚡ New client connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('❌ Client disconnected:', socket.id);
  });
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Error:', err));

const redisClient = redis.createClient({ url: process.env.REDIS_URL });
redisClient.on('error', err => console.error('❌ Redis Client Error:', err));

redisClient.connect().then(() => {
  console.log('✅ Redis Connected');

  app.use(cors());
  app.use(express.json());
  app.use('/api/jobs', jobRoutes);

  server.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
});
