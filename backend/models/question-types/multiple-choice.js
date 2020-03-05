// Import mongoose
const mongoose = require('mongoose');

// Import subdocument schemas
const attachmentSchema = require('../shared/attachment');
const optionSchema = require('../shared/option');

// Create Multiple Choice Schema (blueprint)
const multipleChoiceSchema = mongoose.Schema({
  questionText: {
    type: String,
    required: true
  },
  questionType: {
    type: String,
    required: true
  },
  options: {
    type: [optionSchema.schema],
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
  duration: {
    type: Number,
    default: 0
  },
  points: {
    type: Number,
    default: 0
  },
  isAnsweredCorrectly: {
    type: Boolean,
    required: false
  },
  createdOn: {
    type: Date,
    default: Date.now
  }
});

// Create and export Multiple Choice Model
module.exports = mongoose.model('MultipleChoice', multipleChoiceSchema, 'questions');
