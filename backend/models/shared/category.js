// Import mongoose
const mongoose = require('mongoose');

// Create Category Schema (blueprint)
const categorySchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  createdOn: {
    type: Date,
    default: Date.now()
  }
});

// Create and export Category Model
module.exports = mongoose.model('Category', categorySchema, 'categories');
