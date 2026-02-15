require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const connectDB = require('./src/config/database');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : '*',
        methods: ["GET", "POST", "PUT", "DELETE"]
    }
});

const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB();

// Middleware
app.use(helmet());
app.use(cors({
    origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : '*'
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Socket.io injection into request
app.use((req, res, next) => {
    req.io = io;
    next();
});

// Rate Limiting
const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 1000 // Increased for map loading (77 districts + others)
});
app.use(limiter);

// Routes
app.use('/api/auth', require('./src/routes/authRoutes'));
app.use('/api/districts', require('./src/routes/districtRoutes'));
app.use('/api/candidates', require('./src/routes/candidateRoutes'));
app.use('/api/parties', require('./src/routes/partyRoutes'));
app.use('/api/elections', require('./src/routes/electionRoutes'));
app.use('/api/results', require('./src/routes/resultRoutes'));

// Basic Route for testing
app.get('/', (req, res) => {
    res.send('Nepal Election API is running with Live Updates enabled...');
});

// Socket.io Connection Logic
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error' });
});

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
