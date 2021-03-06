// Import mongoose
const mongoose = require('mongoose');

// Import subdocument schemas
const attachmentSchema = require('../shared/attachment');
const optionSchema = require('../shared/option');
const categorySchema = require('../shared/category');

// Create Checkbox Schema (blueprint)
const checkboxSchema = mongoose.Schema({
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
  modifiedOn: {
    type: Date,
    default: new Date(Date.now())
  }
});

// Create and export Checkbox Model
module.exports = {question: mongoose.model('Checkbox', checkboxSchema, 'questions'), archive: mongoose.model('CheckboxArchive', checkboxSchema, 'archive')};

