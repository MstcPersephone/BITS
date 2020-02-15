// Import mongoose
const mongoose = require('mongoose');

// Import subdocument schemas
const optionSchema = require('./option');
const attachmentSchema = require('./attachment');

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

// Create and export Option Model
module.exports = mongoose.model('Checkbox', checkboxSchema);
