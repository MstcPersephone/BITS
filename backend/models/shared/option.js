// Import mongoose
const mongoose = require('mongoose');

// Create Option Schema (blueprint)
const optionSchema = mongoose.Schema({
  questionId: {
    type: String,
    required: true
  },
  optionText: {
    type: String,
    required: true
  },
  isAnswer: {
    type: Boolean,
    required: true
  },
  isSelected: {
    type: Boolean,
    required: true
  },
  createdOn: {
    type: Date,
    default: Date.now
  }
});

// Export Option schema to use in other schemas
module.exports = optionSchema;

// Create and export Option Model
module.exports = mongoose.model('Option', optionSchema);
