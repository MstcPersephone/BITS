// Import Mongoose
const mongoose = require('mongoose');

// Import subdocument schemas
const assessmentSchema = require('./assessment');
const studentSchema = require('./student');
const questionsSchema = require('./question');

// Create Taken Assessment Schema (blueprint)
const takenAssessmentSchema = mongoose.Schema({
  assessment: {
    type: assessmentSchema.schema,
    required: true
  },
  student: {
    type: studentSchema.schema,
  },
  questions: {
    type: mongoose.Mixed,
  },
  score: {
    type: Number
  },
  studentPassed: {
    type: Boolean
  }
});

// Create and export Taken Assessment Shell Model
module.exports = mongoose.model('TakenAssessment', takenAssessmentSchema, 'takenAssessments');
