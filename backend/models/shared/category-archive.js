// Import mongoose
const mongoose = require('mongoose');

// Create Category Schema (blueprint)
const categoryArchiveSchema = mongoose.Schema({
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
module.exports = mongoose.model('ArchiveCategory', categoryArchiveSchema, 'archiveCategory');
