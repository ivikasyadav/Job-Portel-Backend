// server/server.js
const express = require('express');
const dotenv = require('dotenv');
const colors = require('colors'); // For colorful console output
const cors = require('cors'); // For handling Cross-Origin Resource Sharing
const connectDB = require('./config/db'); // Database connection
const authRoutes = require('./routes/authRoutes');
const jobRoutes = require('./routes/jobRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const { errorHandler } = require('./middleware/errorMiddleware'); // Custom error handling middleware
const http = require('http'); // For WebSocket server
const { WebSocketServer } = require('ws'); // WebSocket library

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const server = http.createServer(app); // Create HTTP server for Express and WebSocket

// Middleware to parse JSON request bodies
app.use(express.json());

// Enable CORS for all origins during development.
// In production, configure this more restrictively to your frontend's URL.
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173', // Allow your frontend origin
    credentials: true // Allow cookies/authorization headers
}));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);

// Root route
app.get('/', (req, res) => {
    res.send('Job Portal API is running...');
});

// Custom error handling middleware (must be at the end of middleware chain)
app.use(errorHandler);

// --- WebSocket Setup for In-App Notifications (Basic Example) ---
const wss = new WebSocketServer({ server });

wss.on('connection', ws => {
    console.log('Client connected to WebSocket');

    ws.on('message', message => {
        console.log(`Received message: ${message}`);
        // Here you could parse messages, identify users, and broadcast
        // For real-time updates, you'd integrate this with your application logic.
        // Example: If a job poster updates an application status, send a WS message
        // to the relevant applicant.
        ws.send('Message received!');
    });

    ws.on('close', () => {
        console.log('Client disconnected from WebSocket');
    });

    ws.on('error', (error) => {
        console.error('WebSocket error:', error);
    });
});

// Expose WebSocket server for other parts of the app to use
// This is a simple way; for more complex apps, use a dedicated utility
app.locals.wss = wss; // Store wss instance on app locals

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`.yellow.bold));
