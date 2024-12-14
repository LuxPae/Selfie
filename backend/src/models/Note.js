const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
    title: String,
    categories: [String],
    text: String,
    creation_date: {type: Date, default: Date.now},
    edit_date: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Note', noteSchema);
