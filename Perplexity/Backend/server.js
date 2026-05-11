import 'dotenv/config';
import { createServer } from 'http';
import { execSync } from 'child_process';
import { Server } from 'socket.io';
import app from './src/app.js';
import connectDB from './src/config/database.js';
import { handleSocketMessage, handleStopGeneration } from './src/controllers/chatController.js';

const PORT = process.env.PORT || 3000;

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  socket.on('sendMessage', (data) => handleSocketMessage(io, socket, data));
  socket.on('stopGeneration', () => handleStopGeneration(socket));
  socket.on('disconnect', () => console.log('Client disconnected:', socket.id));
});

const killPort = (port) => {
  try {
    // Windows: find PID using the port and kill it
    const result = execSync(`netstat -ano | findstr :${port}`, { encoding: 'utf8' });
    const lines = result.trim().split('\n');
    const pids = new Set();
    for (const line of lines) {
      const parts = line.trim().split(/\s+/);
      const pid = parts[parts.length - 1];
      if (pid && pid !== '0') pids.add(pid);
    }
    for (const pid of pids) {
      try {
        execSync(`taskkill /PID ${pid} /F`, { stdio: 'ignore' });
        console.log(`Killed process ${pid} using port ${port}`);
      } catch {}
    }
  } catch {
    // Port was already free — nothing to kill
  }
};

const start = async () => {
  await connectDB();

  httpServer.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });

  httpServer.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`Port ${PORT} is busy — killing existing process and retrying...`);
      killPort(PORT);
      // Short delay to let OS release the port before retrying
      setTimeout(() => {
        httpServer.close();
        httpServer.listen(PORT, () => {
          console.log(`Server running on http://localhost:${PORT} (restarted)`);
        });
      }, 1000);
    } else {
      console.error('Server error:', err);
    }
  });
};

start();