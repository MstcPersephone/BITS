// Import mongoose
const mongoose = require('mongoose');

// Import subdocument schemas
const attachmentSchema = require('../shared/attachment');

// Create True False Schema (blueprint)
const trueFalseSchema = mongoose.Schema({
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
    type: Boolean,
    required: true
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

// Create and export TrueFalse Model
module.exports = mongoose.model('TrueFalse', trueFalseSchema);
