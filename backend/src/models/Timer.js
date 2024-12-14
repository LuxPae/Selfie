const mongoose = require('mongoose');

const timerSchema = new mongoose.Schema({
    cycles: Number,
    studyMinutes: Number,
    pauseMinutes: Number,
    timestampStart: Number,
    timestampEnd: Number,
    mode: String,
    counter: Number
});

module.exports = mongoose.model('Timer', timerSchema);
