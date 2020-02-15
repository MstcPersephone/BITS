// Import mongoose
const mongoose = require('mongoose');

// Import subdocument schemas
const attachmentSchema = require('../shared/attachment');
const optionSchema = require('../shared/option');

// Create Checkbox Schema (blueprint)
const checkboxSchema = mongoose.Schema({
  questionText: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  questionType = {
    type: String,
    required: true
  },
  options: {
    type: [optionSchema],
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
  duration: {
    type: number,
    default: 0
  },
  createdOn: {
    type: Date,
    default: Date.now
  }
});

// Create and export Checkbox Model
module.exports = mongoose.model('Checkbox', checkboxSchema);
