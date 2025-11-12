/**
 * Main Server File
 * Express server setup with authentication routes
 */

require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('./config/passport');
const connectDB = require('./config/database');
const authRoutes = require('./routes/auth');
const cors = require('cors');
const path = require('path');

// Load KYC routes only if dependencies are available
let kycRoutes;
try {
  kycRoutes = require('./routes/kyc');
} catch (error) {
  console.warn('⚠️  KYC routes not loaded. Install dependencies: npm install multer tesseract.js sharp puppeteer axios');
  console.warn('   Error:', error.message);
  kycRoutes = null;
}

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Check if port is available before starting
const net = require('net');
const checkPort = (port) => {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.listen(port, () => {
      server.once('close', () => resolve(true));
      server.close();
    });
    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        resolve(false);
      } else {
        reject(err);
      }
    });
  });
};

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'your-secret-key-change-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production', // HTTPS only in production
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Serve static files (HTML, CSS, images)
app.use(express.static(path.join(__dirname, '..')));

// API Routes
app.use('/api', authRoutes);
if (kycRoutes) {
  app.use('/api', kycRoutes);
}

// Health check route
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error'
  });
});

// Start server with error handling
async function startServer() {
  try {
    // Check if port is available
    const portAvailable = await checkPort(PORT);
    if (!portAvailable) {
      console.error(`❌ Port ${PORT} is already in use!`);
      console.error(`💡 Killing processes on port ${PORT}...`);
      
      // Try to find and kill process on Windows
      const { exec } = require('child_process');
      exec(`netstat -ano | findstr :${PORT}`, (error, stdout) => {
        if (stdout) {
          const lines = stdout.trim().split('\n');
          const pids = new Set();
          lines.forEach(line => {
            const parts = line.trim().split(/\s+/);
            if (parts.length > 0) {
              const pid = parts[parts.length - 1];
              if (pid && !isNaN(pid)) {
                pids.add(pid);
              }
            }
          });
          
          pids.forEach(pid => {
            exec(`taskkill /PID ${pid} /F`, (err) => {
              if (!err) {
                console.log(`✅ Killed process ${pid}`);
              }
            });
          });
          
          // Wait a bit then retry
          setTimeout(() => {
            console.log(`🔄 Retrying to start server on port ${PORT}...`);
            startServer();
          }, 2000);
        } else {
          console.error(`💡 Please manually kill the process or use a different port.`);
          console.error(`   Set PORT=3001 in .env file to use port 3001`);
          process.exit(1);
        }
      });
      return;
    }

    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
    });

    // Handle server errors
    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} is already in use!`);
        console.error(`💡 Solutions:`);
        console.error(`   1. Kill the process: netstat -ano | findstr :${PORT} then taskkill /PID <PID> /F`);
        console.error(`   2. Use a different port by setting PORT in .env file`);
        process.exit(1);
      } else {
        console.error('❌ Server error:', error);
        process.exit(1);
      }
    });

    // Handle process termination
    process.on('SIGTERM', () => {
      console.log('SIGTERM signal received: closing HTTP server');
      server.close(() => {
        console.log('HTTP server closed');
      });
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

