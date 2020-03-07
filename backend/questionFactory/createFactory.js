const mongoose = require('mongoose');
// Import questionType mongoose objects for working with questions collection.
const checkBoxModel = require("../models/question-types/checkbox");
const multipleChoiceModel = require("../models/question-types/multiple-choice");
const trueFalseModel = require("../models/question-types/true-false");
const shortAnswerModel = require("../models/question-types/short-answer");
const uploadAnswerModel = require("../models/question-types/upload");

//*************************************************************//
//****SWITCH STATEMENT TO FIND THE CORRECT QUESTION BY TYPE****//
//*************************************************************//
const questionObject = function createQuestionTypeFactory(question, questionId) {

  // Switch to internal function that creates object to save.
  switch (question.questionType) {
    case "Checkbox":
      questionObjectToSave = createMultipleChoice(question, questionId);
      return questionObjectToSave;

    case "Multiple Choice":
      questionObjectToSave = createCheckbox(question, questionId);
      return questionObjectToSave;

    case "Short Answer":
      questionObjectToSave = createShortAnswer(question, questionId);
      return questionObjectToSave;

    case "True False":
      questionObjectToSave = createTrueFalse(question, questionId);
      return questionObjectToSave;

    case "Upload":
      questionObjectToSave = createUpload(question, questionId);
      return questionObjectToSave;
  }
}

//*************************************//
//*********CHECKBOX OBJECT*************//
//*************************************//
function createCheckbox(question, questionId) {

  // Generates an id for each option
  // Assigns question id to each option
  question.options.forEach((x) => {
    x.id = mongoose.Types.ObjectId(),
      x.questionId = questionId
  });

  // Create Checkbox Model
  const questionModel = new checkBoxModel({
    id: questionId,
    questionText: question.questionText,
    questionType: question.questionType,
    options: question.options,
    hasAttachments: question.hasAttachments,
    attachments: question.attachments,
    isAnswered: question.isAnswered,
    duration: question.duration,
    createdOn: Date.now()
  });

  return questionModel;
}

//**********************************************//
//***********MULTIPLE CHOICE OBJECT*************//
//**********************************************//
function createMultipleChoice(question, questionId) {

  // Generates an id for each option
  // Assigns question id to each option
  question.options.forEach((x) => {
    x.id = mongoose.Types.ObjectId(),
      x.questionId = questionId
  });

  // Create Multiple Choice Model.
  const questionModel = new multipleChoiceModel({
    id: questionId,
    questionText: question.questionText,
    questionType: question.questionType,
    options: question.options,
    hasAttachments: question.hasAttachments,
    attachments: question.attachments,
    isAnswered: question.isAnswered,
    duration: question.duration,
    createdOn: Date.now()
  });

  return questionModel;
}

//**********************************************//
//*************SHORT ANSWER OBJECT**************//
//**********************************************//
function createShortAnswer(question, questionId) {

  // Generates an id for each match option
  // Assigns question id to each match option
  question.matches.forEach((x) => {
    x.id = mongoose.Types.ObjectId(),
      x.questionId = questionId
  });

  // Create Short Answer Model
  const questionModel = new shortAnswerModel({
    id: questionId,
    questionText: question.questionText,
    questionType: question.questionType,
    hasAttachments: question.hasAttachments,
    attachments: question.attachments,
    isAnswered: question.isAnswered,
    answer: question.answer,
    matches: question.matches,
    duration: question.duration,
    createdOn: Date.now()
  });

  return questionModel;
}

//*****************************************//
//***********TRUE/FALSE OBJECT*************//
//*****************************************//
function createTrueFalse(question, questionId) {

  // Create True/False Model
  const questionModel = new trueFalseModel({
    id: questionId,
    questionText: question.questionText,
    questionType: question.questionType,
    hasAttachments: question.hasAttachments,
    attachments: question.attachments,
    isAnswered: question.isAnswered,
    answer: question.answer,
    duration: question.duration,
    createdOn: Date.now()
  });

  return questionModel;
}

//*************************************//
//***********UPLOAD OBJECT*************//
//*************************************//
function createUpload(question, questionId) {

  // Create Upload Model
  const uploadModel = new uploadAnswerModel({
    id: questionId,
    questionText: question.questionText,
    questionType: question.questionType,
    hasAttachments: question.hasAttachments,
    attachments: question.attachments,
    isAnswered: question.isAnswered,
    correctAnswer: question.correctAnswer,
    submittedAnswer: question.submittedAnswer,
    duration: question.duration,
    createdOn: Date.now()
  });

  return uploadModel;
}

// Exports the question object with all properties attached to it.
module.exports = questionObject;
