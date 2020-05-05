// Import mongoose
const mongoose = require('mongoose');

// Create Category Schema (blueprint)
const categorySchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  modifiedOn: {
    type: Date,
    default:new Date(Date.now())
  }
});

// Create and export Category Model
module.exports = mongoose.model('Category', categorySchema, 'categories');
