const mongoose = require('mongoose');

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
    type: [],
    required: true
  },
  status: {
    type: Boolean,
    required: true
  }
});

// Create and export Question Shell Model
module.exports = mongoose.model('Assessment', assessmentSchema, 'assessments');
