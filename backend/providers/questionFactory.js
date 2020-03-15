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
const createQuestionTypeFactory = function (question) {
  // Switch to internal function that creates object to save.
  switch (question.questionType) {
    case "Checkbox":
      return createMultipleChoice(question);

    case "Multiple Choice":
      return createCheckbox(question);

    case "Short Answer":
      return createShortAnswer(question);

    case "True False":
      return createTrueFalse(question);

    case "Upload":
      return createUpload(question);
  }
}

const editQuestionFactory = function (question) {
  // Switch to internal fuction that updates an object.
  switch (question.questionType) {
    case "Checkbox":
      return updateCheckbox(question);
    case "Short Answer":
      return updateShortAnswer(question);
  }
}

//*************************************//
//*********CHECKBOX OBJECT*************//
//*************************************//
function createCheckbox(question) {

  // Generates an id for each option
  // Assigns question id to each option
  question.options.forEach((x) => {
    x.id = mongoose.Types.ObjectId(),
      x.questionId = question._id;
  });

  // Create Checkbox Model
  const questionModel = new checkBoxModel({
    id: question._id,
    questionText: question.questionText,
    questionType: question.questionType,
    options: question.options,
    hasAttachments: question.hasAttachments,
    attachments: question.attachments,
    isAnswered: question.isAnswered,
    assessmentIds: question.assessmentIds,
    duration: question.duration,
    createdOn: Date.now()
  });

  return questionModel;
}

function updateCheckbox(question) {
  // creates an object for updating
  return {
    categories: question.categories,
    questionText: question.questionText,
    questionType: question.questionType,
    options: question.options,
    hasAttachments: question.hasAttachments,
    attachments: question.attachments,
    isAnswered: question.isAnswered,
    assessmentIds: question.assessmentIds,
    duration: question.duration,
    points: question.points,
    isAnsweredCorrectly: question.isAnsweredCorrectly,
    createdOn: question.createdOn
  }
}

//**********************************************//
//***********MULTIPLE CHOICE OBJECT*************//
//**********************************************//
function createMultipleChoice(question) {

  // Generates an id for each option
  // Assigns question id to each option
  question.options.forEach((x) => {
    x.id = mongoose.Types.ObjectId(),
      x.questionId = question._id
  });

  // Create Multiple Choice Model.
  const questionModel = new multipleChoiceModel({
    id: question._id,
    questionText: question.questionText,
    questionType: question.questionType,
    options: question.options,
    hasAttachments: question.hasAttachments,
    attachments: question.attachments,
    isAnswered: question.isAnswered,
    assessmentIds: question.assessmentIds,
    duration: question.duration,
    createdOn: Date.now()
  });

  return questionModel;
}

//**********************************************//
//*************SHORT ANSWER OBJECT**************//
//**********************************************//
function createShortAnswer(question) {

  // Generates an id for each match option
  // Assigns question id to each match option
  question.matches.forEach((x) => {
    x.id = mongoose.Types.ObjectId(),
      x.questionId = question._id;
  });

  // Create Short Answer Model
  const questionModel = new shortAnswerModel({
    id: question._id,
    questionText: question.questionText,
    questionType: question.questionType,
    hasAttachments: question.hasAttachments,
    attachments: question.attachments,
    isAnswered: question.isAnswered,
    studentAnswer: question.studentAnswer,
    matches: question.matches,
    assessmentIds: question.assessmentIds,
    isCaseSensitive: question.isCaseSensitive,
    duration: question.duration,
    createdOn: Date.now()
  });

  return questionModel;
}

function updateShortAnswer(question) {
  // creates an object for updating
  return {
    categories: question.categories,
    questionText: question.questionText,
    questionType: question.questionType,
    hasAttachments: question.hasAttachments,
    attachments: question.attachments,
    isAnswered: question.isAnswered,
    studentAnswer: question.studentAnswer,
    matches: question.matches,
    duration: question.duration,
    points: question.points,
    assessmentIds: question.assessmentIds,
    isCaseSensitive: question.isCaseSensitive,
    isAnsweredCorrectly: question.isAnsweredCorrectly,
    createdOn: question.createdOn
  }
}

//*****************************************//
//***********TRUE/FALSE OBJECT*************//
//*****************************************//
function createTrueFalse(question) {

  // Create True/False Model
  const questionModel = new trueFalseModel({
    id: question._id,
    questionText: question.questionText,
    questionType: question.questionType,
    hasAttachments: question.hasAttachments,
    attachments: question.attachments,
    isAnswered: question.isAnswered,
    studentAnswer: question.studentAnswer,
    answer: question.answer,
    assessmentIds: question.assessmentIds,
    duration: question.duration,
    createdOn: Date.now()
  });

  return questionModel;
}

//*************************************//
//***********UPLOAD OBJECT*************//
//*************************************//
function createUpload(question) {

  // Create Upload Model
  const uploadModel = new uploadAnswerModel({
    id: question._id,
    questionText: question.questionText,
    questionType: question.questionType,
    hasAttachments: question.hasAttachments,
    attachments: question.attachments,
    isAnswered: question.isAnswered,
    correctAnswer: question.correctAnswer,
    submittedAnswer: question.submittedAnswer,
    assessmentIds: question.assessmentIds,
    duration: question.duration,
    createdOn: Date.now()
  });

  return uploadModel;
}

// Exports the question object with all properties attached to it.
module.exports = {createQuestionTypeFactory, editQuestionFactory};
