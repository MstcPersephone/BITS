const mongoose = require('mongoose');

// Import subdocument schemas
const assessmentConfigSchema = require('./assessment-config');

// Create Assessment archive Schema (blueprint)
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

// Create and export Assessment Archive Shell Model
module.exports = mongoose.model('AssessmentArchive', assessmentArchiveSchema, 'archiveAssessment');
