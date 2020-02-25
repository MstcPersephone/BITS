// Import mongoose
const mongoose = require('mongoose');

// Import subdocument schemas
const attachmentSchema = require('../shared/attachment');
const exactMatchSchema = require('../shared/exact-match');

// Create Essay Schema (blueprint)
const shortAnswerSchema = mongoose.Schema({
  questionText: {
    type: String,
    required: true
  },
  questionType: {
    type: String,
    required: true
  },
  hasAttachments: {
    type: Boolean,
    required: true
  },
  attachments: {
    type: [attachmentSchema.schema]
  },
  isAnswered: {
    type: Boolean,
    required: true
  },
  answer: {
    type: String,
    default: 'Not answered'
  },
  matches: {
    type: [exactMatchSchema.schema]
  },
  duration: {
    type: Number,
    default: 0
  },
  createdOn: {
    type: Date,
    default: Date.now
  }
});

// Create and export Essay Model
module.exports = mongoose.model('ShortAnswer', shortAnswerSchema, 'questions');
