// Import mongoose
const mongoose = require('mongoose');

// Create Attachment Schema (blueprint)
const attachmentSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  fileType: {
    type: String,
    required: true
  },
  content: {
    type: mongoose.Mixed,
    required: true
  },
  createdOn: {
    type: Date,
    default: Date.now
  }
});

// Export Attachment schema to use in other schemas
module.exports = attachmentSchema;

// Create and export Attachment Model
module.exports = mongoose.model('Attachment', attachmentSchema);
