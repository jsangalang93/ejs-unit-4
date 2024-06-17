const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
    time: String,
    date: String,
    title: String,
    mood: String,
    entry: String
});

const Logs = mongoose.model('Logs', logSchema);

module.exports = Logs;