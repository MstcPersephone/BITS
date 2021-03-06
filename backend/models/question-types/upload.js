// Import mongoose
const mongoose = require('mongoose');

// Import subdocument schemas
const attachmentSchema = require('../shared/attachment');
const categorySchema = require('../shared/category');

// Create Upload Schema (blueprint)
const uploadSchema = mongoose.Schema({
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
  correctAnswer: {
    type: [attachmentSchema.schema]
  },
  submittedAnswer: {
    type: [attachmentSchema.schema]
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
  modifiedOn: {
    type: Date,
    default: new Date(Date.now())
  }
});

// Create and export Upload Model
module.exports = {question: mongoose.model('Upload', uploadSchema, 'questions'), archive: mongoose.model('UploadArchive', uploadSchema, 'archive')};
