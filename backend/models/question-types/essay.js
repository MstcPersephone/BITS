// Import mongoose
const mongoose = require('mongoose');

// Import subdocument schemas
const attachmentSchema = require('../shared/attachment');

// Create Essay Schema (blueprint)
const essaySchema = mongoose.Schema({
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
    type: String,
    default: 'Not answered'
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

// Create and export Essay Model
module.exports = mongoose.model('Essay', essaySchema, 'questions');
