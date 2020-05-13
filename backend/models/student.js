// Import Mongoose
const mongoose = require('mongoose');

// Import subdocument schemas
const scoreSchema = require('./score');

// Create Student Schema (blueprint)
const studentSchema = mongoose.Schema({
  uniqueStudentIdentifier: {
    type: String,
    required: true
  },
  studentId: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  dateOfBirth: {
    type: Date,
    required: true
  },
  campusLocation: {
    type: String,
    required: true
  },
  lastAssessmentDate: {
    type: Date,
    required: true
  },
  previousScores: {
    type: [scoreSchema.schema],
    default: null
  }
});

// Create and export Student Shell Model
module.exports = mongoose.model('Student', studentSchema, 'students');
