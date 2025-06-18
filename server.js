const express = require('express');
const dotenv = require('dotenv');
const colors = require('colors');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const jobRoutes = require('./routes/jobRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const { errorHandler } = require('./middleware/errorMiddleware');
const http = require('http');
const { WebSocketServer } = require('ws');

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);
app.use(express.json());

const allowedOrigins = [
    'http://localhost:5173',
    'https://job-fronted-hhs6dmwnn-vikas-yadavs-projects-29cd5a79.vercel.app',
    // 'https://job-fronted-hhs6dmwnn-vikas-yadavs-projects-29cd5a79.vercel.app/api',
    'job-fronted-alpha.vercel.app',
    // 'job-fronted-alpha.vercel.app/api'
  ];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin.trim())) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));

app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);

app.get('/', (req, res) => {
    res.send('Job Portal API is running...');
});

app.use(errorHandler);

const wss = new WebSocketServer({ server });

wss.on('connection', ws => {
    console.log('Client connected to WebSocket');

    ws.on('message', message => {
        console.log(`Received message: ${message}`);
        ws.send('Message received!');
    });

    ws.on('close', () => {
        console.log('Client disconnected from WebSocket');
    });

    ws.on('error', (error) => {
        console.error('WebSocket error:', error);
    });
});

app.locals.wss = wss;

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`.yellow.bold));
