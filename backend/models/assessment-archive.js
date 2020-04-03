const mongoose = require('mongoose');

// Import subdocument schemas
const assessmentConfigSchema = require('./assessment-config');

// Create Assessment Schema (blueprint)
const assessmentArchiveSchema = mongoose.Schema({
  name: {
    type: String
  },
  description: {
    type: String
  },
  config: {
    type: assessmentConfigSchema.schema
  },
  questionIds: {
    type: [String]
  },
  status: {
    type: String
  }
});

// Create and export Assessment Shell Model
module.exports = mongoose.model('AssessmentArchive', assessmentArchiveSchema, 'archiveAssessment');
