// Import mongoose
const mongoose = require('mongoose');

// Create Assessment Configuration Schema (blueprint)
const assessmentConfigSchema = mongoose.Schema({
  isRandom: {
    type: Boolean,
    default: false
  },
  isTimed: {
    type: Boolean,
    default: false
  },
  maxTime: {
    type: Number,
    default: 0
  },
  duration: {
    type: Number,
    default: 0
  },
  wrongStreak: {
    type: Number,
    default: 0
  },
  minimumScore: {
    type: Number,
    default: 75
  },
});

// Create and export Assessment Configuration Model
module.exports = mongoose.model('AssessmentConfig', assessmentConfigSchema, 'assessmentConfig');
