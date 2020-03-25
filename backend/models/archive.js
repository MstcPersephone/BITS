// Import mongoose
const mongoose = require('mongoose');

// Empty Question Schema
// Used to access the question collection generically
const archiveSchema = mongoose.Schema({});

// Create and export Question Shell Model
module.exports = mongoose.model('Archive', archiveSchema, 'archive');
