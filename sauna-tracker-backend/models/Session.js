const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true
    },
    duration: {
        type: Number,
        required: true,
        min: 1,
        max: 60
    },
    temperature: {
        type: Number,
        required: true,
        min: 120,
        max: 230
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Session', sessionSchema); 
