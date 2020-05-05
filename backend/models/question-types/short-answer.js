// Import mongoose
const mongoose = require('mongoose');

// Import subdocument schemas
const attachmentSchema = require('../shared/attachment');
const exactMatchSchema = require('../shared/exact-match');
const categorySchema = require('../shared/category');

// Create Short Answer Schema (blueprint)
const shortAnswerSchema = mongoose.Schema({
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
  studentAnswer: {
    type: String
  },
  matches: {
    type: [exactMatchSchema.schema]
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
  isCaseSensitive: {
    type: Boolean,
    default: false
  },
  assessmentIds: {
    type: [String]
  },
  modifiedOn: {
    type: Date,
    default: new Date(Date.now())
  }
});

// Create and export Short Answer Model
module.exports = {question: mongoose.model('ShortAnswer', shortAnswerSchema, 'questions'), archive: mongoose.model('ShortAnswerArchive', shortAnswerSchema, 'archive')};

