const mongoose = require('mongoose');

// Import subdocument schemas
const assessmentConfigSchema = require('./assessment-config');

// Create Assessment Schema (blueprint)
const assessmentSchema = mongoose.Schema({
  name: {
    type: String
  },
  description: {
    type: String
  },
  config: {
    type: assessmentConfigSchema.schema,
    required: true
  },
  questionIds: {
    type: [String]
  },
  status: {
    type: String,
    default: "In Progress"
  }
});

// Create and export Assessment Shell Model
module.exports = mongoose.model('Assessment', assessmentSchema, 'assessments');
