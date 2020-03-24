// Import mongoose
const mongoose = require('mongoose');

// Empty Question Schema
// Used to access the question collection generically
const questionSchema = mongoose.Schema({});

// Create and export Question Shell Model
module.exports = mongoose.model('Question', questionSchema, 'questions');
module.exports = mongoose.model('Archived', questionSchema, 'archived');
