const mongoose = require('mongoose');

// Create Score Schema (blueprint)
const scoreSchema = mongoose.Schema({
  assessmentId: {
    type: String,
    required: true
  },
  numberOfQuestionsAsked: {
    type: Number,
    required: true
  },
  numberOfCorrectAnswers: {
    type: Number,
    required: true
  },
  isPassingScore: {
    type: Boolean,
    required: true
  },
  scoreResultText: {
    type: String,
    required: true
  }
});

// Export Score schema to use in other schemas
module.exports = scoreSchema;

// Create and export Score Shell Model
module.exports = mongoose.model('Score', scoreSchema, 'scores');
