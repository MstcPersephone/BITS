// Import mongoose
const mongoose = require('mongoose');

// Import subdocument schemas
const attachmentSchema = require('../attachment');

// Create Upload Schema (blueprint)
const uploadSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  questionText: {
    type: String,
    required: true
  },
  questionType = {
    type: String,
    required: true
  },
  hasAttachments: {
    type: Boolean,
    required: true
  },
  attachments: {
    type: [attachmentSchema]
  },
  isAnswered: {
    type: Boolean,
    required: true
  },
  answer: {
    type: [attachmentSchema]
  },
  duration: {
    type: number,
    default: 0
  },
  createdOn: {
    type: Date,
    default: Date.now
  }
});

// Create and export Upload Model
module.exports = mongoose.model('Upload', uploadSchema);
