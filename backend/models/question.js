// Import mongoose
const mongoose = require('mongoose');

// Empty Question Schema
// Used to access the question collection generically
const questionSchema = mongoose.Schema({});

// Create and export Question Shell Model
module.exports = { questions: mongoose.model('Question', questionSchema, 'questions'), archive: mongoose.model('Archive', questionSchema, 'archive')};
