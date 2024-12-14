const mongoose = require('mongoose');

const SessionSchema = new mongoose.Schema({
    cycles: {
        type: Number,
        require: true,
    },
    studyMinutes: {
        type: Number,
        required: true,
    },
    pauseMinutes: {
        type: Number,
        required: true,
    },
    timestampStart: {
        type: Number,
        required: true,
    },
    timestampEnd: {
        type: Number,
        required: true,
    },
    mode: {
        type: String,
        enum: ['study', 'pause'],
        required: true,
    },
    counter: {
        type: Number,
        required: true
    },
});
