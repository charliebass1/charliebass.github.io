require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Updated CORS configuration
app.use(cors({
    origin: ['https://charliebass1.github.io', 'http://localhost:5000'],
    methods: ['GET', 'POST', 'DELETE', 'PUT', 'OPTIONS'],
    allowedHeaders: ['Content-Type']
}));

app.use(express.json());

// Add a basic root route
app.get('/', (req, res) => {
    res.json({ message: "Sauna Tracker API is running" });
});

// Routes
app.use('/api/sessions', require('./routes/sessions'));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});