// Import mongoose
const mongoose = require('mongoose');

// Import subdocument schemas
const attachmentSchema = require('../shared/attachment');
const categorySchema = require('../shared/category');

// Create True False Schema (blueprint)
const trueFalseSchema = mongoose.Schema({
  categories: {
    type: [categorySchema.schema],
    required: true
  },
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
    type: Boolean,
    required: true
  },
  studentAnswer: {
    type: String,
    default: 'Not answered'
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
  assessmentIds: {
    type: [String],
    required: true
  },
  createdOn: {
    type: Date,
    default: Date.now
  }
});

// Create and export TrueFalse Model
module.exports = mongoose.model('TrueFalse', trueFalseSchema, 'questions');
