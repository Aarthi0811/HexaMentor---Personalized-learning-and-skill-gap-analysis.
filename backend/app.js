require('dotenv').config(); // Must be first

// Set AI service URL if not already configured
if (!process.env.AI_SERVICE_URL) {
    process.env.AI_SERVICE_URL = 'http://localhost:8001';
}

const express = require('express');
const cors = require('cors');
const authRoutes = require('./src/routes/authRoutes');
const aiRoutes = require('./src/routes/aiRoutes');
const dbConfig = require('./src/config/db');

const app = express();

app.use(express.json());

// CORS middleware
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:5173'],
    credentials: true
}));

// Database connection disabled for AI testing
console.log('Running in AI-only mode - database connection disabled');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/ai', aiRoutes);

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
 