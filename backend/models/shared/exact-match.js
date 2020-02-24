// Import mongoose
const mongoose = require('mongoose');

// Create ExactMatch Schema (blueprint)
const exactMatchSchema = mongoose.Schema({
  questionId: {
    type: String,
    required: true
  },
  matchText: {
    type: String,
    required: true
  },
  createdOn: {
    type: Date,
    default: Date.now()
  }
});

// Export ExactMatch schema to use in other schemas
module.exports = exactMatchSchema;

// Create and export ExactMatch Model
module.exports = mongoose.model('ExactMatch', exactMatchSchema, 'exact-matches');
