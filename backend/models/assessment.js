const mongoose = require('mongoose');

// Import subdocument schemas
const assessmentConfigSchema = require('./assessment-config');

// Create Assessment Schema (blueprint)
const assessmentSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  config: {
    type: assessmentConfigSchema.schema,
    required: true
  },
  questionIds: {
    type: [String],
    required: true
  },
  status: {
    type: String,
    default: "In Progress"
  }
});

// Create and export Assessment Shell Model
module.exports = { assessments = mongoose.model('Assessment', assessmentSchema, 'assessments'), archive = mongoose.model('ArchiveAssessment', assessmentSchema, 'archiveAssessment')};
